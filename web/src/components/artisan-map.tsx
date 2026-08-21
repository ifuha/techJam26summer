"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const locations: [number, number][] = [
  [35.6764, 139.65],
  [35.4437, 139.638],
  [35.6639, 138.5683],
  [36.2048, 138.2529],
];

const markerIcon = L.divIcon({
  className: "artisan-map-marker",
  html: "<span><i></i></span>",
  iconSize: [38, 46],
  iconAnchor: [19, 43],
});

export default function ArtisanMap() {
  return (
    <MapContainer center={[35.65, 139.05]} zoom={8} zoomControl className="leaflet-artisan-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((position, index) => (
        <Marker key={index} position={position} icon={markerIcon} />
      ))}
    </MapContainer>
  );
}
