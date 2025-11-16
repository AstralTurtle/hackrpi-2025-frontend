import { useState, useRef, useEffect } from "react";
import { StatisticsBar } from "./components/StatisticsBar";
import { MenuBar } from "./components/MenuBar";
import { SidePanel } from "./components/SidePanel";
import { GameMap, type GameMapRef } from "./components/GameMap";
import { StationDetailsPanel } from "./components/panels/StationDetailsPanel";
import { BuildPanel } from "./components/panels/BuildPanel";
import { FinancePanel } from "./components/panels/FinancePanel";
import { PoliticsPanel } from "./components/panels/PoliticsPanel";
import { ResearchPanel } from "./components/panels/ResearchPanel";
import { LinesPanel } from "./components/panels/LinesPanel";
import { JoinModal } from "./components/JoinModal";
import { LobbyModal } from "./components/LobbyModal";
import type { Station, Game, Player, StationDetails } from "../types/game";
import stations from "../src/stations.json";

const WS_BASE_URL = "ws://localhost:8000/game";

function App() {
  const wsRef = useRef<WebSocket | null>(null);
  const mapRef = useRef<GameMapRef>(null);

  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [selectedStation, setSelectedStation] = useState<Station | undefined>(
    undefined
  );

  //variables?
  const [game, setGame] = useState<Game>({
    code: "",
    year: 0,
    turns: 0,
    lines: [],
    contracts: [],
  });

  const [player, setPlayer] = useState<Player>({
    name: "",
    money: 0,
  });

  const [joinOpen, setJoinOpen] = useState(false);
  const [joinRoom, setJoinRoom] = useState<string>("");
  const [lobbyOpen, setLobbyOpen] = useState<boolean>(false);
  const [lobbyCode, setLobbyCode] = useState<string | null>(null);

  // Handles WebSocket events
  const handleJoin = async ({ room }: { room?: string }) => {
    console.log("Join requested", { room });

    if (!room) return;

    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      try {
        wsRef.current.close();
      } catch {}
    }

    const url = `${WS_BASE_URL}/${encodeURIComponent(room)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      console.info("WebSocket connected to", url);
    });

    ws.addEventListener("message", (ev) => {
      console.debug("ev", ev);
      console.debug("WS message:", ev.data);

      try {
        const payload =
          typeof ev.data === "string" ? JSON.parse(ev.data) : ev.data;

        if (payload && payload.game_data) {
          console.info("Received game_data", payload);
          try {
            const gd = payload.game_data;
            if (gd.game) {
              setGame(gd.game as Game);
            }
            if (gd.player) {
              setPlayer(gd.player as Player);
            }
            console.info("process game_data");
          } catch (err) {
            console.error("Failed to process game_data", err);
          }
        }

        if (payload && payload.action === "start") {
          console.info("Server requested start - closing modals");
          setLobbyOpen(false);
          setJoinOpen(false);

          try {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({}));
            }
          } catch (err) {
            console.error("Failed to request game_data from server", err);
          }
        }
      } catch (err) {
        console.debug("WS message parse error", err);
      }
    });

    ws.addEventListener("error", (ev) => {
      console.error("WebSocket error", ev);
    });

    ws.addEventListener("close", () => {
      console.info("WebSocket closed for", room);
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    });

    setLobbyCode(room);
    setLobbyOpen(true);
  };

  // Ensures WebSocket is closed when client is closed
  useEffect(() => {
    return () => {
      try {
        wsRef.current?.close();
      } catch {}

      wsRef.current = null;
    };
  }, []);

  // Create game request — returns the room/code string
  const createGameRequest = async (): Promise<string> => {
    const res = await fetch("http://localhost:8000/game/create_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Create game failed: ${res.status}`);
    const json = await res.json();
    const code = json?.code;
    if (!code) throw new Error("No code returned from server");

    return String(code);
  };

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);

    const stationsDictionary = stations as Record<string, StationDetails>;
    mapRef.current?.flyToStation([
      stationsDictionary[station.id].lat,
      stationsDictionary[station.id].lon,
    ]);
  };

  const handleClosePanel = () => {
    setActivePanel(null);
    setSelectedStation(undefined);
  };

  // Determine panel title and content based on state
  const getPanelTitle = () => {
    if (selectedStation) return "Station Details";
    if (activePanel) return activePanel.toUpperCase();
    return "";
  };

  const getPanelContent = () => {
    // If a station is selected, show station details
    if (selectedStation) {
      return <StationDetailsPanel station={selectedStation} />;
    }

    // Otherwise, show the appropriate panel content
    switch (activePanel) {
      case "build":
        return <BuildPanel />;
      case "finance":
        return <FinancePanel />;
      case "politics":
        return <PoliticsPanel />;
      case "research":
        return <ResearchPanel />;
      case "lines":
        return (
          <LinesPanel lines={game.lines} onStationClick={handleStationClick} />
        );
      default:
        return null;
    }
  };

  const bid = (bid: number, biddable: string) => {
    wsRef.current?.send(
      JSON.stringify({ action: "bid", bid: bid, biddable: biddable })
    );
  };

  const build = (line: string, id: string) => {
    wsRef.current?.send(JSON.stringify({ action: "bid", line: line, id: id }));
  };

  const end_turn = () => {
    wsRef.current?.send(JSON.stringify({ action: "end_turn" }));
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black">
      <div className="flex flex-row">
        <div className="h-full aspect-3/2 flex flex-col p-2">
          <div className="h-full w-full border-white border-3 rounded-md">
            <div className="h-3/5 w-full bg-slate-900 border-3 border-white text-center flex justify-center items-center text-6xl font-extrabold text-amber-900">
              {player.name.split("").join(" ")}
            </div>
            <div className="h-2/5 w-full bg-slate-900 border-3 border-white text-center flex justify-center items-center text-4xl font-bold text-white">
              LINES
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <StatisticsBar
            counters={[
              { id: "money", label: "Money", value: player.money, icon: "💵" },
            ]}
          />

          <MenuBar
            buttons={[
              {
                id: "bid",
                label: "Bid",
                icon: "💰",
                onClick: () => {
                  setSelectedStation(undefined);
                  setActivePanel(activePanel === "bid" ? null : "bid");
                },
              },
              {
                id: "lines",
                label: "Lines",
                icon: "🚆",
                onClick: () => {
                  setSelectedStation(undefined);
                  setActivePanel(activePanel === "lines" ? null : "lines");
                },
              },
              {
                id: "join",
                label: "Join",
                icon: "🔗",
                onClick: () => {
                  setJoinOpen(true);
                },
              },
            ]}
            activeButton={activePanel}
          />
        </div>
        <div className="ml-auto w-64 h-full p-4">
          <div className="h-full w-full bg-black border-3 border-slate-700 flex items-center justify-center text-center text-4xl text-white">
            📅 {game.year}
          </div>
        </div>
        <div
          className="text-3xl bg-white h-40 w-40"
          onClick={() => {
            end_turn();
          }}
        >
          End Turn
        </div>
      </div>

      {/* Main Content Area: Map with overlay panel */}
      <div className="flex-1 relative overflow-hidden">
        {/* Game Map (always full width) */}
        <GameMap ref={mapRef} onStationClick={handleStationClick} />

        {/* Side Panel (overlays on top of map) */}
        <SidePanel
          isOpen={activePanel !== null}
          title={getPanelTitle()}
          onClose={handleClosePanel}
        >
          {getPanelContent()}
        </SidePanel>

        {/* Join Modal */}
        <JoinModal
          isOpen={joinOpen}
          onClose={() => {
            setJoinOpen(false);
            setJoinRoom("");
          }}
          onJoin={handleJoin}
          onCreate={createGameRequest}
          initialRoom={joinRoom || undefined}
          onOpenLobby={(code) => {
            setLobbyCode(code);
            setLobbyOpen(true);
          }}
        />

        <LobbyModal
          isOpen={lobbyOpen}
          onClose={() => setLobbyOpen(false)}
          code={lobbyCode}
          onClaimTeam={(team) => {
            // send claim over socket if available
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
              console.warn("Cannot claim team: socket not open");
              return;
            }
            wsRef.current.send(JSON.stringify({ action: "join", team }));
          }}
          onStart={() => {
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
              console.warn("Cannot start game: socket not open");
            } else {
              try {
                wsRef.current.send(JSON.stringify({ action: "start" }));
              } catch (err) {
                console.error("Failed to send start action", err);
              }
            }
            // Do not close modals here; the server will send an action: 'start' message
            // which the client handles and will close modals when appropriate.
          }}
        />
      </div>
    </div>
  );
}
export default App;
