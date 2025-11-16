import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Line, Station, StationDetails } from "../../../types/game";
import stations_json from "../../stations.json";

const stationDetails = stations_json as Record<string, StationDetails>;

interface LinesPanelProps {
  lines: Line[];
  onStationClick: (station: Station, line: Line) => void;
}

// Color scheme for each owner
const OWNER_COLORS = {
  unclaimed: {
    bg: "bg-gray-600",
    text: "text-gray-400",
    border: "border-gray-500",
  },
  IRT: { bg: "bg-red-600", text: "text-red-400", border: "border-red-500" },
  BMT: { bg: "bg-blue-600", text: "text-blue-400", border: "border-blue-500" },
  IND: {
    bg: "bg-green-600",
    text: "text-green-400",
    border: "border-green-500",
  },
};

// Helper function to calculate ownership percentages
const calculateOwnership = (lineStations: Station[]) => {
  const total = lineStations.length;
  if (total === 0) {
    return { unclaimed: 100, IRT: 0, BMT: 0, IND: 0 };
  }

  const ownership: Record<string, number> = {
    unclaimed: 0,
    IRT: 0,
    BMT: 0,
    IND: 0,
  };

  lineStations.forEach((station) => {
    if (!(station.owner)) {
      ownership["unclaimed"]++;
    } else {
      ownership[station.owner.name]++;
    }
  });

  return {
    unclaimed: (ownership.unclaimed / total) * 100,
    IRT: (ownership.IRT / total) * 100,
    BMT: (ownership.BMT / total) * 100,
    IND: (ownership.IND / total) * 100,
  };
};

// Helper to get player ownership percentage (IRT only)
const getPlayerOwnership = (lineStations: Station[]): number => {
  const ownership = calculateOwnership(lineStations);
  return ownership.IRT;
};

export const LinesPanel: React.FC<LinesPanelProps> = ({
  lines,
  onStationClick,
}) => {
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());

  const toggleLine = (lineId: string) => {
    setExpandedLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lineId)) {
        newSet.delete(lineId);
      } else {
        newSet.add(lineId);
      }
      return newSet;
    });
  };

  return (
    <>
      <p className="mb-6 text-gray-400">
        Track your progress on each subway line. Click a line to see station
        details.
      </p>

      <div className="space-y-3">
        {lines.map((line) => {
          const lineStations = line.stations;
          const ownership = calculateOwnership(lineStations);
          const isExpanded = expandedLines.has(line.name);

          return (
            <div
              key={line.name}
              className="bg-gray-700 rounded border border-gray-600"
            >
              {/* Line Header - Clickable */}
              <div
                onClick={() => toggleLine(line.name)}
                className="p-4 cursor-pointer hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-lg">
                    {line.name}
                  </h3>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.div>
                </div>

                {/* Ownership Percentage Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{lineStations.length} stations</span>
                    <span>Your control: {Math.round(ownership.IRT)}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden flex">
                    {/* IRT segment */}
                    {ownership.IRT > 0 && (
                      <div
                        className={`${OWNER_COLORS.IRT.bg} transition-all`}
                        style={{ width: `${ownership.IRT}%` }}
                      />
                    )}
                    {/* BMT segment */}
                    {ownership.BMT > 0 && (
                      <div
                        className={`${OWNER_COLORS.BMT.bg} transition-all`}
                        style={{ width: `${ownership.BMT}%` }}
                      />
                    )}
                    {/* IND segment */}
                    {ownership.IND > 0 && (
                      <div
                        className={`${OWNER_COLORS.IND.bg} transition-all`}
                        style={{ width: `${ownership.IND}%` }}
                      />
                    )}
                    {/* Unclaimed segment */}
                    {ownership.unclaimed > 0 && (
                      <div
                        className={`${OWNER_COLORS.unclaimed.bg} transition-all`}
                        style={{ width: `${ownership.unclaimed}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 ${OWNER_COLORS.IRT.bg} rounded`} />
                    <span className="text-gray-400">
                      IRT {Math.round(ownership.IRT)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 ${OWNER_COLORS.BMT.bg} rounded`} />
                    <span className="text-gray-400">
                      BMT {Math.round(ownership.BMT)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-3 h-3 ${OWNER_COLORS.IND.bg} rounded`} />
                    <span className="text-gray-400">
                      IND {Math.round(ownership.IND)}%
                    </span>
                  </div>
                  {ownership.unclaimed > 0 && (
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-3 h-3 ${OWNER_COLORS.unclaimed.bg} rounded`}
                      />
                      <span className="text-gray-400">
                        Unclaimed {Math.round(ownership.unclaimed)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Station List - Animated Dropdown */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-600 p-4 bg-gray-750">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Stations on this line
                      </h4>
                      <div className="space-y-2">
                        {lineStations.map((station: Station) => (
                          <div
                            key={station.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStationClick(station, line);
                            }}
                            className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-650 cursor-pointer transition-colors"
                          >
                            <span className="text-sm text-white">
                              {stationDetails[station.id].name}
                            </span>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center`}
                              >
                                <span className="text-xs font-bold text-white">
                                  {station.owner ?
                                    station.owner.name.substring(0, 1):"Unclaimed"
                                    }
                                </span>
                              </div>
                              <span className={`text-xs font-semibold`}>
                                {station.owner ?
                                  station.owner.name:  "Unclaimed"
                                   }
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-gray-700 p-3 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Total Lines
          </div>
          <div className="text-2xl font-bold text-white">{lines.length}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Your Lines
          </div>
          <div className="text-2xl font-bold text-red-400">
            {
              lines.filter((line) => {
                const lineStations = line.stations;
                return getPlayerOwnership(lineStations) > 50;
              }).length
            }
          </div>
        </div>
      </div>
    </>
  );
};
