// WebSocket service for game communication

export interface GameData {
  game: {
    code: string;
    year: number;
    turn: number;
    lines: any[];
    contracts: any[];
  };
  player?: {
    name: string;
    money: number;
  };
}

export type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  connect(gameCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`ws://localhost:8080/game/${gameCode}`);

        this.ws.onopen = () => {
          console.log("WebSocket connected to game:", gameCode);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("WebSocket received:", data);

            // Notify all registered handlers
            this.messageHandlers.forEach((handler) => handler(data));
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);

          // Try to reconnect if not a policy violation or game full
          if (event.code !== 1008 && event.code !== 1013) {
            this.attemptReconnect(gameCode);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(gameCode: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        this.connect(gameCode).catch((error) => {
          console.error("Reconnection failed:", error);
        });
      }, this.reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      console.log("WebSocket sent:", data);
    } else {
      console.error("WebSocket is not connected");
    }
  }

  // Send empty request to get current game state
  requestGameState() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send("");
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // Game actions
  joinTeam(team: "IRT" | "BMT") {
    this.send({ action: "join", team });
  }

  startGame() {
    this.send({ action: "start" });
  }

  submitBid(biddable: string, bid: number) {
    this.send({ action: "bid", biddable, bid });
  }

  buildStation(line: string, id: string) {
    this.send({ action: "build", line, id });
  }

  endTurn() {
    this.send({ action: "end_turn" });
  }
}

// Singleton instance
export const wsService = new WebSocketService();
