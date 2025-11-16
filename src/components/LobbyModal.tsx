import React from "react";
import { Modal } from "./Modal";

interface LobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string | null;
  onClaimTeam: (team: "IRT" | "BMT") => void;
  onStart?: () => void;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  isOpen,
  onClose,
  code,
  onClaimTeam,
  onStart,
}) => {
  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      // ignore clipboard failures silently
      console.warn("Clipboard write failed", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lobby">
      <div className="space-y-4">
        <p className="text-sm text-gray-300">
          Share this code with friends to join the lobby
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-800 text-white px-3 py-2 rounded font-mono text-lg select-all">
            {code ?? "—"}
          </div>
          <button
            onClick={copyCode}
            disabled={!code}
            className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded disabled:opacity-60"
          >
            Copy
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onClaimTeam("IRT")}
            disabled={!code}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-60"
          >
            Become IRT
          </button>
          <button
            onClick={() => onClaimTeam("BMT")}
            disabled={!code}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded disabled:opacity-60"
          >
            Become BMT
          </button>
        </div>

        <div className="flex justify-end items-center gap-2">
          <button
            onClick={onStart}
            disabled={!code}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-60"
          >
            Start Game
          </button>

          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LobbyModal;
