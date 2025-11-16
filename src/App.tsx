import { useState, useRef } from "react";
import { StatisticsBar } from "./components/StatisticsBar";
import { MenuBar } from "./components/MenuBar";
import { SidePanel } from "./components/SidePanel";
import { GameMap, type GameMapRef } from "./components/GameMap";
import { StationDetailsPanel } from "./components/panels/StationDetailsPanel";
import { LinesPanel } from "./components/panels/LinesPanel";
import { JoinModal } from "./components/JoinModal";
import { LobbyModal } from "./components/LobbyModal";
import type { Station, Game, Player, StationDetails, Line } from "../types/game";
import stations_json from "../src/stations.json";
import { BidPanel } from "./components/panels/BidPanel";
import { useWebSocket } from "./hooks/useWebSocket";

// const WS_BASE_URL = "ws://140.82.13.6:8000/game";
const WS_BASE_URL = "ws://localhost:8000/game";

function App() {
  const { connect, send, setTeam } = useWebSocket(WS_BASE_URL);
  const mapRef = useRef<GameMapRef>(null);

  const [activePanel, setActivePanel] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<Station | undefined>(
    undefined
  );
  const [selectedLine, setSelectedLine] = useState<Line | undefined>(
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

    connect(
      room,
      (payload) => {
        // Handle incoming parsed payload
        console.debug("WS payload", payload);

        if (payload && payload.game_data) {
          console.info("Received game_data", payload);
          try {
            const gd = payload.game_data;
            if (gd.game) {
              setGame(gd.game as Game);
            }
            if (gd.player) {
              setPlayer(gd.player as Player);
              // Store team name for reconnection
              if (gd.player.name) {
                setTeam(gd.player.name);
              }
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
            send({});
          } catch (err) {
            console.error("Failed to request game_data from server", err);
          }
        }

        if (payload && payload.action === "reconnect_required") {
          console.info("Server requires reconnect with team name");
          // Send reconnect action with the current player's team name
          if (player.name) {
            send({ action: "reconnect", team: player.name });
            console.info("Sent reconnect with team:", player.name);
          } else {
            console.warn("No player name available for reconnect");
          }
        }

        if (payload && payload.notify) {
          alert(payload.notify);
        }
      },
      () => {
        console.info("WebSocket opened for", room);
      },
      () => {
        console.info("WebSocket closed for", room);
      }
    );

    setLobbyCode(room);
    setLobbyOpen(true);
  };

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

  const handleStationClick = (station: Station, line: Line) => {
    setSelectedStation(station);
    setSelectedLine(line)

    const stationsDictionary = stations_json as Record<string, StationDetails>;
    mapRef.current?.flyToStation([
      stationsDictionary[station.id].lat,
      stationsDictionary[station.id].lon,
    ]);
  };

  const handleClosePanel = () => {
    setActivePanel("");
    setSelectedStation(undefined);
    setSelectedLine(undefined);
  };

  // Determine panel title and content based on state
  const getPanelTitle = () => {
    if (selectedStation) return "Station Details";
    if (activePanel) return activePanel.toUpperCase();
    return "";
  };

  const getPanelContent = () => {
    // If a station is selected, show station details
    if (selectedStation && selectedLine) {
        const stationsDictionary = stations_json as Record<string, StationDetails>;
      return <StationDetailsPanel  player={player} line={selectedLine} station={selectedStation} stationDetails={stationsDictionary} build={build}/>;
    }

    const stationsDictionary = stations_json as Record<string, StationDetails>;
    // Otherwise, show the appropriate panel content
    switch (activePanel) {
      case "bid":
        return <BidPanel lines={game.lines} Contracts={game.contracts} currentPlayer={player.name} currentYear={game.year} playerMoney={player.money}  bid={bid}  stationDetails={stationsDictionary} />;
      case "lines":
        return (
          <LinesPanel lines={game.lines} onStationClick={handleStationClick} />
        );
      default:
        return <></>;
    }
  };

  const bid = (bid: number, biddable: string) => {
    send({ action: "bid", bid: bid, biddable: biddable });
  };

  const build = (line: string, id: string) => {
    send({ action: "build", line: line, id: id });
  };

  const end_turn = () => {
    send({ action: "end_turn" });
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
                  setSelectedLine(undefined);
                  setActivePanel(activePanel === "bid" ? "" : "bid");
                },
              },
              {
                id: "lines",
                label: "Lines",
                icon: "🚆",
                onClick: () => {
                  setSelectedStation(undefined);
                  setSelectedLine(undefined);
                  setActivePanel(activePanel === "lines" ? "" : "lines");
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
        <button
          className="text-4xl bg-blue-400 rounded-md h-full w-40 p-4"
          onClick={() => {
            end_turn();
          }}
        >
          End Turn
        </button>
      </div>

      {/* Main Content Area: Map with overlay panel */}
      <div className="flex-1 relative overflow-hidden">
        {/* Game Map (always full width) */}
        <GameMap ref={mapRef} lines={game.lines} stationDetails={stations_json} onStationClick={handleStationClick} />

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
            send({ action: "join", team });
          }}
          onStart={() => {
            try {
              send({ action: "start" });
            } catch (err) {
              console.error("Failed to send start action", err);
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
