import { useRef, useImperativeHandle, forwardRef } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Line, Station, StationDetails } from "../../types/game";
import { StationMarker } from "./StationMarker";

interface GameMapProps {
  lines: Line[];
  stationDetails: Record<string, StationDetails>
  onStationClick?: (station: Station, line: Line) => void;
}

export interface GameMapRef {
  flyToStation: (position: [number, number]) => void;
}

// Helper component to access map instance
const MapController = forwardRef<GameMapRef>((_, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    flyToStation: (position: [number, number]) => {
      map.flyTo(position, 16, {
        duration: 1.5,
      });
    },
  }));

  return null;
});

MapController.displayName = "MapController";

export const GameMap = forwardRef<GameMapRef, GameMapProps>(
  ({ lines, onStationClick, stationDetails }, ref) => {
    // New York City coordinates
    const NYC_CENTER: [number, number] = [40.7128, -74.006];
    const mapControllerRef = useRef<GameMapRef>(null);

    useImperativeHandle(ref, () => ({
      flyToStation: (position: [number, number]) => {
        mapControllerRef.current?.flyToStation(position);
      },
    }));

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
          <MapController ref={mapControllerRef} />

          {/* Render station markers */}
          {lines.flatMap((line) =>
            line.stations.map((station) => (
              <StationMarker
                key={station.id}
                line={line}
                stationDetail={stationDetails}
                station={station}
                onClick={onStationClick ?? (() => {})}
              />
            ))
          )}
        </MapContainer>
      </div>
    );
  }
);

GameMap.displayName = "GameMap";
