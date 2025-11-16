import React from "react";
import type { Station, Line, StationDetails, Player } from "../../../types/game";

interface StationDetailsPanelProps {
  station: Station;
  line: Line;
  stationDetails: Record<string, StationDetails>
  player: Player;
  build: (line: string, id: string) => void;
}

export const StationDetailsPanel: React.FC<StationDetailsPanelProps> = ({
  station, line, stationDetails, build, player
}) => {

  return (
    <>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          {stationDetails[station.id].name ?? station.id}
        </h3>
        {/* <div className="text-sm text-gray-400">Station ID: {station.id}</div> */}
      </div>

      {/* Station Stats */}
      <div className="space-y-4">
        {/* <div className="bg-gray-700 p-4 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Daily Ridership
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {station.ridership.toLocaleString()}
          </div>
        </div> */}

        <div className="bg-gray-700 p-4 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Construction Cost
          </div>
          <div className="text-2xl font-bold text-green-400">
            ${station.cost.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Revenue
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {station.revenue}
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Year awarded
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {station.awarded_year}
          </div>
        </div>
        {/* 
        <div className="bg-gray-700 p-4 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Subway Lines
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {station.lineIds.map((lineId) => (
              <span
                key={lineId}
                className="px-3 py-1 bg-gray-600 rounded-full text-sm font-semibold"
              >
                {lineId}
              </span>
            ))}
          </div>
        </div> */}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded transition-colors" onClick={()=>{build(line.name, station.id)}}>
          Build
        </button>
      </div>
      
    </>
  );
};
