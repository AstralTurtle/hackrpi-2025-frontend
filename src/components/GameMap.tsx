import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const GameMap: React.FC = () => {
  // New York City coordinates
  const NYC_CENTER: [number, number] = [40.7128, -74.0060];

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer
        center={NYC_CENTER}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {/* Add your custom markers and buttons here later */}
      </MapContainer>
    </div>
  );
};