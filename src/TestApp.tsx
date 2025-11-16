import { useState, useRef, useEffect } from "react";
import { CounterBar } from "./components/CounterBar";
import { ActionButtonBar } from "./components/ActionButtonBar";
import { SidePanel } from "./components/SidePanel";
import { GameMap, GameMapRef } from "./components/GameMap";
import { GameLobbyModal } from "./components/GameLobbyModal";
import { TeamSelectionModal } from "./components/TeamSelectionModal";
import { StationPanel } from "./components/panels/StationPanel";
import { LinesPanel } from "./components/panels/LinesPanel";
import { ContractsPanel } from "./components/panels/ContractsPanel";
import {
  GameCounter,
  ActionButton,
  PanelType,
  Station,
  Line,
  Bid,
  Owner,
} from "./types/game";
import { wsService, GameData } from "./services/websocket";

enum GameState {
  NotConnected = "NOT_CONNECTED",
  Lobby = "LOBBY",
  Active = "ACTIVE",
  Finished = "FINISHED",
}

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.NotConnected);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [selectedStation, setSelectedStation] = useState<Station | undefined>(
    undefined
  );
  const mapRef = useRef<GameMapRef>(null);

  // Lobby state
  const [showLobbyModal, setShowLobbyModal] = useState(true);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<"IRT" | "BMT" | null>(null);
  const [irtTaken, setIrtTaken] = useState(false);
  const [bmtTaken, setBmtTaken] = useState(false);

  // Game state from backend
  const [currentPlayer, setCurrentPlayer] = useState<Owner>("IRT");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [activeBids, setActiveBids] = useState<Bid[]>([]);
  const [contracts, setContracts] = useState<any[]>([]); // Raw contracts from backend

  // WebSocket message handler
  useEffect(() => {
    const handleMessage = (data: any) => {
      console.log("App received WebSocket message:", data);

      // Handle game start
      if (data.action === "start") {
        setGameState(GameState.Active);
        setShowTeamSelection(false);
        // Request initial game state
        wsService.requestGameState();
        return;
      }

      // Handle game data updates
      if (data.game_data) {
        const newGameData: GameData = data.game_data;
        setGameData(newGameData);

        // Update player info
        if (newGameData.player) {
          setCurrentPlayer(newGameData.player.name as Owner);
        }

        // Convert backend data to frontend format
        if (newGameData.game) {
          // Convert lines
          const backendLines = newGameData.game.lines || [];
          const convertedLines: Line[] = backendLines.map((line: any) => ({
            id: line.name.toLowerCase().replace(/\s+/g, "-"),
            name: line.name,
            stationIds: line.stations.map((s: any) => s.id),
            exclusiveOwner: line.owner as Owner,
            exclusiveUntil: line.awarded_year + 2,
            lastAuctionYear: line.awarded_year,
          }));
          setLines(convertedLines);

          // Convert stations
          const allStations: Station[] = [];
          backendLines.forEach((line: any) => {
            line.stations.forEach((station: any) => {
              allStations.push({
                id: station.id,
                name: station.id, // Using ID as name for now
                position: [40.7128, -74.006], // Default NYC position - replace with actual data
                owner: (station.owner as Owner) || "unclaimed",
                ridership: station.revenue * 10000, // Estimate from revenue
                cost: station.cost * 1000000,
                yearBuilt: line.year,
                lineIds: [line.name.toLowerCase().replace(/\s+/g, "-")],
              });
            });
          });
          setStations(allStations);

          // Store raw contracts for ContractsPanel
          let backendContracts = newGameData.game.contracts || [];
          setContracts(backendContracts);

          // Convert contracts to bids
          backendContracts = newGameData.game.contracts || [];
          const convertedBids: Bid[] = backendContracts.map(
            (contract: any, index: number) => ({
              id: `bid-${index}`,
              lineId:
                contract.biddable.name?.toLowerCase().replace(/\s+/g, "-") ||
                `bid-${index}`,
              leadingBidder: (contract.highest_bidder as Owner) || "unclaimed",
              amount: contract.highest_bid,
              expiresYear: contract.deadline_year,
            })
          );
          setActiveBids(convertedBids);
        }
      }

      // Handle notifications
      if (data.notify) {
        alert(data.notify);
      }

      // Handle win condition
      if (data.action === "win") {
        setGameState(GameState.Finished);
        alert(`Game Over! Winner: ${data.team}`);
      }
    };

    wsService.onMessage(handleMessage);

    return () => {
      wsService.removeMessageHandler(handleMessage);
    };
  }, []);

  // Join game handler
  const handleJoinGame = async (code: string) => {
    try {
      await wsService.connect(code);
      setGameCode(code);
      setShowLobbyModal(false);
      setShowTeamSelection(true);
      setGameState(GameState.Lobby);
    } catch (error) {
      alert("Failed to join game. Please check the code and try again.");
      console.error("Failed to join game:", error);
    }
  };

  // Team selection handler
  const handleSelectTeam = (team: "IRT" | "BMT") => {
    wsService.joinTeam(team);
    setSelectedTeam(team);

    // Update team status
    if (team === "IRT") {
      setIrtTaken(true);
    } else {
      setBmtTaken(true);
    }
  };

  // Start game handler
  const handleStartGame = () => {
    wsService.startGame();
  };

  // Compute counters from game data
  const counters: GameCounter[] = gameData?.player
    ? [
        {
          id: "money",
          label: "Money",
          value: gameData.player.money,
          icon: "💰",
        },
        { id: "year", label: "Year", value: gameData.game.year, icon: "📅" },
        {
          id: "stations",
          label: "Stations",
          value: stations.filter((s) => s.owner === currentPlayer).length,
          icon: "🚉",
        },
        {
          id: "lines",
          label: "Lines",
          value: lines.filter((l) => l.exclusiveOwner === currentPlayer).length,
          icon: "🚇",
        },
      ]
    : [
        { id: "money", label: "Money", value: 0, icon: "💰" },
        { id: "year", label: "Year", value: 1879, icon: "📅" },
        { id: "stations", label: "Stations", value: 0, icon: "🚉" },
        { id: "lines", label: "Lines", value: 0, icon: "🚇" },
      ];

  // Bid handlers
  const handleSubmitBid = (biddable: string, amount: number) => {
    wsService.submitBid(biddable, amount);
  };

  // Build station handler
  const handleBuildStation = (stationId: string, lineId: string) => {
    // Convert lineId to line name for backend
    const line = lines.find((l) => l.id === lineId);
    if (line) {
      wsService.buildStation(line.name, stationId);
    }
  };

  // Action buttons - only Contracts and Lines
  const actionButtons: ActionButton[] = [
    {
      id: "contracts",
      label: "Contracts",
      icon: "📜",
      onClick: () => {
        setSelectedStation(undefined);
        setActivePanel(activePanel === "contracts" ? null : "contracts");
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
  ];

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    // Don't change activePanel - station panel shows in place of active panel content
    // Zoom/pan to station
    mapRef.current?.flyToStation(station.position);
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
    // If a station is selected, show station panel (takes precedence)
    if (selectedStation) {
      return (
        <StationPanel
          station={selectedStation}
          currentPlayer={currentPlayer}
          playerMoney={gameData?.player?.money || 0}
          onBuild={handleBuildStation}
        />
      );
    }

    // Otherwise, show the appropriate panel content
    switch (activePanel) {
      case "contracts":
        return (
          <ContractsPanel
            contracts={contracts}
            lines={lines}
            stations={stations}
            currentPlayer={currentPlayer}
            playerMoney={gameData?.player?.money || 0}
            onSubmitBid={handleSubmitBid}
          />
        );
      case "lines":
        return <LinesPanel lines={lines} onStationClick={handleStationClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Game Lobby Modal */}
      <GameLobbyModal
        isOpen={showLobbyModal}
        onJoinGame={handleJoinGame}
        onClose={() => setShowLobbyModal(false)}
      />

      {/* Team Selection Modal */}
      <TeamSelectionModal
        isOpen={showTeamSelection}
        gameCode={gameCode}
        onSelectTeam={handleSelectTeam}
        onStartGame={handleStartGame}
        canStart={irtTaken && bmtTaken}
        irtTaken={irtTaken}
        bmtTaken={bmtTaken}
        selectedTeam={selectedTeam}
      />

      {/* Top Counter Bar */}
      <CounterBar counters={counters} />

      {/* Action Button Bar */}
      <ActionButtonBar buttons={actionButtons} activeButton={activePanel} />

      {/* Main Content Area: Map with overlay panel */}
      <div className="flex-1 relative overflow-hidden">
        {/* Game Map (always full width) */}
        <GameMap
          ref={mapRef}
          stations={stations}
          onStationClick={handleStationClick}
        />

        {/* Side Panel (overlays on top of map) */}
        <SidePanel
          isOpen={activePanel !== null}
          title={getPanelTitle()}
          onClose={handleClosePanel}
        >
          {getPanelContent()}
        </SidePanel>
      </div>
    </div>
  );
}

export default App;
