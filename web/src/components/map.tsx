"use client";

import { useEffect, useRef } from "react";
import { Map as MapTilerMap, Marker, config } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { getCrafts, getUsers } from "../lib/api";
import type { CraftSummary } from "../lib/type";

const JAPAN_CENTER: [number, number] = [137.5, 36.5];
const JAPAN_ZOOM = 5;
const MAP_STYLE_ID = "01a01db7-e4de-76e5-8a2c-b4a303f2fbb9";
const CRAFT_ZOOM_THRESHOLD = 9;
const CRAFT_PIN_DEFAULT_COLOR = "#5E7231";
const CRAFT_PIN_SELECTED_COLOR = "#F47A65";
const CRAFT_PIN_WIDTH = 30;
const CRAFT_PIN_HEIGHT = 43;
const SVG_NS = "http://www.w3.org/2000/svg";
// Path data from api/Agent/Group 11.svg (viewBox 0 0 51 73)
const PIN_FILL_PATH =
  "M22.44 70.6286C23.205 71.5384 24.3206 72.0652 25.5 72.0652C26.6794 72.0652 27.795 71.5384 28.56 70.6286L45.0872 41.8857C48.9013 37.2946 50.9928 31.5125 51 25.54C51 11.4611 39.5569 0 25.5 0C11.4431 0 0 11.4611 0 25.54C0 31.51 2.10375 37.3044 5.91281 41.8857L22.44 70.6286Z";
const PIN_OUTLINE_PATH =
  "M22.44 70.6286C23.205 71.5384 24.3206 72.0652 25.5 72.0652C26.6794 72.0652 27.795 71.5384 28.56 70.6286L45.0872 41.8857C48.9013 37.2946 50.9928 31.5125 51 25.54C51 11.4611 39.5569 0 25.5 0C11.4431 0 0 11.4611 0 25.54C0 31.51 2.10375 37.3044 5.91281 41.8857L22.44 70.6286ZM4.78125 25.54C4.78125 14.0949 14.0728 4.78876 25.5 4.78876C36.9272 4.78876 46.2188 14.0949 46.2188 25.54C46.2193 30.3926 44.5218 35.0919 41.4216 38.8209L25.5 66.8295C25.5 66.8295 12.674 42.5526 9.57844 38.8209C6.48292 35.0892 4.78612 30.3916 4.78125 25.54Z";

type LocatedCraft = CraftSummary & { latitude: number; longitude: number };

function createCraftPinElement(count: number, cityName: string | null) {
  // NOTE: this element is handed to maplibre-gl as the Marker's own
  // `.maplibregl-marker` node, which relies on its stylesheet rule
  // `position: absolute` for coordinate placement. Do NOT set an inline
  // `position` on `root` here — it would win over that rule and knock
  // every marker into normal document flow (pins stack top-to-bottom in
  // insertion order instead of sitting at their map coordinates).
  const root = document.createElement("div");
  root.style.width = `${CRAFT_PIN_WIDTH}px`;
  root.style.cursor = "pointer";

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.width = `${CRAFT_PIN_WIDTH}px`;
  wrapper.style.height = `${CRAFT_PIN_HEIGHT}px`;
  wrapper.style.transformOrigin = "bottom center";
  root.appendChild(wrapper);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", `${CRAFT_PIN_WIDTH}`);
  svg.setAttribute("height", `${CRAFT_PIN_HEIGHT}`);
  svg.setAttribute("viewBox", "0 0 51 73");
  svg.style.display = "block";

  const fillPath = document.createElementNS(SVG_NS, "path");
  fillPath.setAttribute("fill-rule", "evenodd");
  fillPath.setAttribute("clip-rule", "evenodd");
  fillPath.setAttribute("d", PIN_FILL_PATH);
  fillPath.setAttribute("fill", CRAFT_PIN_DEFAULT_COLOR);
  svg.appendChild(fillPath);

  const outlinePath = document.createElementNS(SVG_NS, "path");
  outlinePath.setAttribute("fill-rule", "evenodd");
  outlinePath.setAttribute("clip-rule", "evenodd");
  outlinePath.setAttribute("d", PIN_OUTLINE_PATH);
  outlinePath.setAttribute("fill", "#FFFFFF");
  svg.appendChild(outlinePath);

  wrapper.appendChild(svg);

  const label = document.createElement("div");
  label.style.position = "absolute";
  label.style.inset = "0";
  label.style.height = `${CRAFT_PIN_HEIGHT * 0.6}px`;
  label.style.display = "flex";
  label.style.alignItems = "center";
  label.style.justifyContent = "center";
  label.style.color = "#FFFFFF";
  label.style.fontSize = "12px";
  label.style.fontWeight = "bold";
  label.style.pointerEvents = "none";
  label.textContent = String(count);
  wrapper.appendChild(label);

  if (cityName) {
    const cityLabel = document.createElement("div");
    cityLabel.style.position = "absolute";
    cityLabel.style.top = `${CRAFT_PIN_HEIGHT + 2}px`;
    cityLabel.style.left = "50%";
    cityLabel.style.transform = "translateX(-50%)";
    cityLabel.style.padding = "1px 6px";
    cityLabel.style.borderRadius = "4px";
    cityLabel.style.color = "#000000";
    cityLabel.style.fontSize = "11px";
    cityLabel.style.fontWeight = "bold";
    cityLabel.style.whiteSpace = "nowrap";
    cityLabel.style.textAlign = "center";
    cityLabel.style.pointerEvents = "none";
    cityLabel.textContent = cityName;
    wrapper.appendChild(cityLabel);
  }

  const setSelected = (selected: boolean) => {
    fillPath.setAttribute(
      "fill",
      selected ? CRAFT_PIN_SELECTED_COLOR : CRAFT_PIN_DEFAULT_COLOR,
    );
  };

  const setScale = (scale: number) => {
    wrapper.style.transform = `scale(${scale})`;
  };

  return { root, setSelected, setScale };
}

function pinScaleForZoom(zoom: number) {
  const MIN_SCALE = 0.8;
  const MAX_SCALE = 2;
  const scale = MIN_SCALE + (zoom - JAPAN_ZOOM) * 0.1;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export type MapProps = {
  onCraftClick?: (craft: CraftSummary) => void;
  onCraftInView?: (craft: CraftSummary | null) => void;
  filterTag?: string | null;
};

export function Map({ onCraftClick, onCraftInView, filterTag }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapTilerMap | null>(null);
  const craftMarkersRef = useRef<
    {
      craft: LocatedCraft;
      element: HTMLElement;
      setSelected: (selected: boolean) => void;
      setScale: (scale: number) => void;
    }[]
  >([]);
  // `globalThis.Map` because this component is itself named `Map`, which
  // shadows the built-in Map constructor/type for the rest of this module.
  const craftTagsRef = useRef<globalThis.Map<string, Set<string>>>(
    new globalThis.Map(),
  );
  const filterTagRef = useRef<string | null | undefined>(filterTag);
  filterTagRef.current = filterTag;

  const applyCraftFilter = () => {
    const tag = filterTagRef.current;
    craftMarkersRef.current.forEach(({ craft, element }) => {
      const visible = !tag || craftTagsRef.current.get(craft.craftId)?.has(tag);
      element.style.display = visible ? "" : "none";
    });
  };

  useEffect(() => {
    applyCraftFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTag]);

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

    map.on("zoom", () => {
      const scale = pinScaleForZoom(map.getZoom());
      craftMarkersRef.current.forEach(({ setScale }) => setScale(scale));
    });

    Promise.all([getCrafts(), getUsers()])
      .then(([fetchedCrafts, users]) => {
        crafts = fetchedCrafts.filter(
          (craft): craft is LocatedCraft =>
            craft.latitude !== null && craft.longitude !== null,
        );
        updateCraftInView();

        const craftTags = new globalThis.Map<string, Set<string>>();
        users.forEach((user) => {
          if (!user.craftId) return;
          const tags = craftTags.get(user.craftId) ?? new Set<string>();
          user.tags.forEach((tag) => tags.add(tag));
          craftTags.set(user.craftId, tags);
        });
        craftTagsRef.current = craftTags;

        craftMarkersRef.current = crafts.map((craft) => {
          const { root, setSelected, setScale } = createCraftPinElement(
            craft.successorCount,
            craft.address,
          );
          setScale(pinScaleForZoom(map.getZoom()));

          new Marker({ element: root })
            .setLngLat([craft.longitude, craft.latitude])
            .addTo(map);

          root.addEventListener("click", (event) => {
            event.stopPropagation();
            craftMarkersRef.current.forEach(
              ({ craft: other, setSelected: setOtherSelected }) => {
                setOtherSelected(other.craftId === craft.craftId);
              },
            );
            onCraftClick?.(craft);
          });

          return { craft, element: root, setSelected, setScale };
        });

        applyCraftFilter();
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
