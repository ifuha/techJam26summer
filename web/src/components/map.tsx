"use client";

import { useEffect, useRef } from "react";
import { Map as MapTilerMap, Marker, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { getCrafts, getUsers } from "../lib/api";
import type { CraftSummary, UserPublic } from "../lib/type";

const JAPAN_CENTER: [number, number] = [137.5, 36.5];
const JAPAN_ZOOM = 5;
const MAP_STYLE_ID = "01a01db7-e4de-76e5-8a2c-b4a303f2fbb9";
const CRAFT_ZOOM_THRESHOLD = 9;

type LocatedCraft = CraftSummary & { latitude: number; longitude: number };

export type MapProps = {
  onPinClick?: (user: UserPublic) => void;
  onCraftInView?: (craft: CraftSummary | null) => void;
};

export function Map({ onPinClick, onCraftInView }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapTilerMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "";
    config.apiKey = apiKey;

    const map = new MapTilerMap({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/${MAP_STYLE_ID}/style.json?key=${apiKey}`,
      center: JAPAN_CENTER,
      zoom: JAPAN_ZOOM,
    });
    mapRef.current = map;

    let crafts: LocatedCraft[] = [];

    const updateCraftInView = () => {
      if (!onCraftInView) return;

      if (map.getZoom() < CRAFT_ZOOM_THRESHOLD) {
        onCraftInView(null);
        return;
      }

      const bounds = map.getBounds();
      const inView = crafts.filter((craft) =>
        bounds.contains([craft.longitude, craft.latitude]),
      );

      if (inView.length === 0) {
        onCraftInView(null);
        return;
      }

      const center = map.getCenter();
      const nearest = inView.reduce((closest, craft) => {
        const distance =
          (craft.latitude - center.lat) ** 2 +
          (craft.longitude - center.lng) ** 2;
        const closestDistance =
          (closest.latitude - center.lat) ** 2 +
          (closest.longitude - center.lng) ** 2;
        return distance < closestDistance ? craft : closest;
      });
      onCraftInView(nearest);
    };

    map.on("zoomend", updateCraftInView);
    map.on("moveend", updateCraftInView);

    getUsers()
      .then((users) => {
        users
          .filter(
            (
              user,
            ): user is typeof user & { latitude: number; longitude: number } =>
              user.latitude !== null && user.longitude !== null,
          )
          .forEach((user) => {
            const el = document.createElement("img");
            el.src = "/pin.svg";
            el.alt = "";
            el.style.width = "32px";
            el.style.height = "32px";
            el.style.cursor = "pointer";

            const marker = new Marker({ element: el })
              .setLngLat([user.longitude, user.latitude])
              .addTo(map);

            marker.getElement().addEventListener("click", (event) => {
              event.stopPropagation();
              onPinClick?.(user);
            });
          });
      })
      .catch((error) => {
        console.error("Failed to load users for map:", error);
      });

    getCrafts()
      .then((fetched) => {
        crafts = fetched.filter(
          (craft): craft is LocatedCraft =>
            craft.latitude !== null && craft.longitude !== null,
        );
        updateCraftInView();
      })
      .catch((error) => {
        console.error("Failed to load crafts for map:", error);
      });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[400px]" />;
}
