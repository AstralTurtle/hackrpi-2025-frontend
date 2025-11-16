import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamSelectionModalProps {
  isOpen: boolean;
  gameCode: string;
  onSelectTeam: (team: "IRT" | "BMT") => void;
  onStartGame: () => void;
  canStart: boolean;
  irtTaken: boolean;
  bmtTaken: boolean;
  selectedTeam: "IRT" | "BMT" | null;
}

export const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({
  isOpen,
  gameCode,
  onSelectTeam,
  onStartGame,
  canStart,
  irtTaken,
  bmtTaken,
  selectedTeam,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-100"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 w-[600px]"
          >
            <div className="bg-gray-800 rounded-lg border-2 border-gray-700 shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b-2 border-gray-700">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide text-center">
                  Game Lobby
                </h2>
                <div className="text-center text-sm text-gray-400 mt-2">
                  Code:{" "}
                  <span className="text-yellow-400 font-mono">{gameCode}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center text-gray-300 mb-6">
                  Select your company to begin
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* IRT Team */}
                  <button
                    onClick={() => onSelectTeam("IRT")}
                    disabled={irtTaken && selectedTeam !== "IRT"}
                    className={`
                      p-6 rounded-lg border-2 transition-all
                      ${
                        selectedTeam === "IRT"
                          ? "bg-red-900/30 border-red-500"
                          : irtTaken
                            ? "bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed"
                            : "bg-gray-700 border-gray-600 hover:border-red-500 hover:bg-red-900/20"
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">🚇</div>
                    <div className="text-xl font-bold text-red-400 mb-1">
                      IRT
                    </div>
                    <div className="text-xs text-gray-400">
                      Interborough Rapid Transit
                    </div>
                    {selectedTeam === "IRT" && (
                      <div className="mt-3 text-green-400 text-sm">
                        ✓ Selected
                      </div>
                    )}
                    {irtTaken && selectedTeam !== "IRT" && (
                      <div className="mt-3 text-gray-500 text-sm">Taken</div>
                    )}
                  </button>

                  {/* BMT Team */}
                  <button
                    onClick={() => onSelectTeam("BMT")}
                    disabled={bmtTaken && selectedTeam !== "BMT"}
                    className={`
                      p-6 rounded-lg border-2 transition-all
                      ${
                        selectedTeam === "BMT"
                          ? "bg-blue-900/30 border-blue-500"
                          : bmtTaken
                            ? "bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed"
                            : "bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-blue-900/20"
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">🚊</div>
                    <div className="text-xl font-bold text-blue-400 mb-1">
                      BMT
                    </div>
                    <div className="text-xs text-gray-400">
                      Brooklyn-Manhattan Transit
                    </div>
                    {selectedTeam === "BMT" && (
                      <div className="mt-3 text-green-400 text-sm">
                        ✓ Selected
                      </div>
                    )}
                    {bmtTaken && selectedTeam !== "BMT" && (
                      <div className="mt-3 text-gray-500 text-sm">Taken</div>
                    )}
                  </button>
                </div>

                {/* Start Game Button */}
                <button
                  onClick={onStartGame}
                  disabled={!canStart}
                  className={`
                    w-full font-semibold py-4 px-6 rounded transition-colors text-lg
                    ${
                      canStart
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {canStart ? "Start Game" : "Waiting for players..."}
                </button>

                {!canStart && (
                  <div className="text-center text-sm text-gray-500 mt-3">
                    Both teams must be filled to start
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
