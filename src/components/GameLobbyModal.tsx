import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createGame } from "../../services/api";

interface GameLobbyModalProps {
  isOpen: boolean;
  onJoinGame: (gameCode: string) => void;
  onClose: () => void;
}

export const GameLobbyModal: React.FC<GameLobbyModalProps> = ({
  isOpen,
  onJoinGame,
  onClose,
}) => {
  const [mode, setMode] = useState<"main" | "create" | "join">("main");
  const [gameCode, setGameCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateGame = async () => {
    setIsCreating(true);
    setError("");

    try {
      const code = await createGame();
      setGameCode(code);
      setMode("create");
    } catch (err) {
      setError("Failed to create game. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = () => {
    if (gameCode.trim()) {
      onJoinGame(gameCode.trim());
    } else {
      setError("Please enter a game code");
    }
  };

  const resetModal = () => {
    setMode("main");
    setGameCode("");
    setError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 rounded-lg border-2 border-gray-700 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-gray-700">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                  {mode === "main" && "Subway Builder"}
                  {mode === "create" && "Game Created"}
                  {mode === "join" && "Join Game"}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Main Menu */}
                {mode === "main" && (
                  <div className="space-y-4">
                    <button
                      onClick={handleCreateGame}
                      disabled={isCreating}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded transition-colors text-lg"
                    >
                      {isCreating ? "Creating..." : "Create New Game"}
                    </button>

                    <button
                      onClick={() => setMode("join")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded transition-colors text-lg"
                    >
                      Join Existing Game
                    </button>

                    {error && (
                      <div className="bg-red-900/30 border border-red-700 text-red-400 p-3 rounded text-sm">
                        {error}
                      </div>
                    )}
                  </div>
                )}

                {/* Game Created */}
                {mode === "create" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">
                        Your Game Code
                      </div>
                      <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-4">
                        <div className="text-4xl font-bold text-yellow-400 tracking-wider font-mono">
                          {gameCode}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Share this code with another player
                      </div>
                    </div>

                    <button
                      onClick={() => onJoinGame(gameCode)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition-colors"
                    >
                      Enter Lobby
                    </button>

                    <button
                      onClick={resetModal}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
                    >
                      Back
                    </button>
                  </div>
                )}

                {/* Join Game */}
                {mode === "join" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Enter Game Code
                      </label>
                      <input
                        type="text"
                        value={gameCode}
                        onChange={(e) =>
                          setGameCode(e.target.value.toUpperCase())
                        }
                        placeholder="XXXXXXXX"
                        maxLength={8}
                        className="w-full bg-gray-900 text-white text-center text-2xl font-mono tracking-wider p-4 rounded border-2 border-gray-600 focus:border-yellow-500 focus:outline-none uppercase"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-900/30 border border-red-700 text-red-400 p-3 rounded text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleJoinGame}
                      disabled={!gameCode.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded transition-colors"
                    >
                      Join Game
                    </button>

                    <button
                      onClick={resetModal}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition-colors"
                    >
                      Back
                    </button>
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
