const API_BASE_URL = "http://localhost:8000";

import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";

interface JoinPayload {
  room?: string;
}

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (payload: JoinPayload) => Promise<any> | void;
  /** optional initial room code to prefill */
  initialRoom?: string;
  /** optional create-game callback that returns the created room code */
  onCreate?: () => Promise<string>;
  /** optional callback that tells the parent to open the lobby UI for a room */
  onOpenLobby?: (room: string) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  initialRoom,
  onCreate, // prefer external create if provided
  onOpenLobby,
}) => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>(initialRoom || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Generate a random display name since player doesn't choose it
  useEffect(() => {
    if (!name) {
      const generated = `Player-${Math.random().toString(36).slice(2, 8)}`;
      setName(generated);
    }
  }, [name]);

  // Keep room in sync when initialRoom changes (e.g., create flow)
  useEffect(() => {
    if (initialRoom) setRoom(initialRoom);
  }, [initialRoom]);

  const validate = () => {
    if (!name.trim()) {
      setError("Missing generated player name.");
      return false;
    }
    if (room && !/^[A-Za-z0-9_-]{3,32}$/.test(room)) {
      setError("Room code must be 3-32 characters, letters, numbers, _ or -");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = onJoin({
        room: room.trim() || undefined,
      });
      if (result instanceof Promise) await result;
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  const onCreateLocal = async () => {
    let data = await fetch(API_BASE_URL + "/game/create_game", {
      method: "POST",
    });
    let json = await data.json();
    return json.code;
  };

  const handleCreateClick = async () => {
    setCreateLoading(true);
    setError(null);
    try {
      // prefer prop onCreate, fall back to local implementation
      const code = onCreate ? await onCreate() : await onCreateLocal();
      if (!code) throw new Error("No room code returned from create");

      setRoom(String(code));

      // join the newly created lobby directly (call onJoin)
      const result = onJoin({
        room: String(code),
      });
      if (result instanceof Promise) await result;

      // close the join modal and notify parent to open the lobby UI
      //   onClose();
      onOpenLobby?.(String(code));
    } catch (err: any) {
      setError(err?.message || "Create game failed");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Game">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* display name is generated client-side and not shown to the player */}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Room code
          </label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Room code (provided by create or enter to join a public lobby)"
          />
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateClick}
            disabled={createLoading}
            className="basis-1/3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded disabled:opacity-60 p-4"
          >
            {createLoading ? "Creating…" : "Create Game"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="basis-1/3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded disabled:opacity-60 p-4"
          >
            {loading ? "Joining…" : "Join Game"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="basis-1/3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded p-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
