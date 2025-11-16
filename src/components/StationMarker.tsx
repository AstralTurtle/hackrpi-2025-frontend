import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Station, Line, StationDetails } from "../../types/game";

interface StationMarkerProps {
  stationDetail: Record<string, StationDetails>;
  station : Station;
  line: Line;
  onClick: (station: Station, line: Line) => void;
}

// Create a custom icon for stations
const createStationIcon = (color: string = "#ef4444") => {
  return L.divIcon({
    className: "custom-station-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const StationMarker: React.FC<StationMarkerProps> = ({
  station,
  stationDetail,
  line,
  onClick,
}) => {
  return (
    <Marker
      position={[stationDetail[station.id].lat, stationDetail[station.id].lon]}
      icon={createStationIcon()}
      eventHandlers={{
        click: () => onClick(station, line),
      }}
    >
      <Popup>
        <div className="text-sm">
          <strong>{station.id}</strong>
          <br />
          Click for more details
        </div>
      </Popup>
    </Marker>
  );
};
