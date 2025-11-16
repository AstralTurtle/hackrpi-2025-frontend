import { useRef, useEffect, useCallback } from "react";

type MessageHandler = (payload: any) => void;

const HEARTBEAT_INTERVAL = 30000; // send ping every 30s
const HEARTBEAT_TIMEOUT = 10000; // wait 10s for pong before closing

export function useWebSocket(baseUrl: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const currentRoomRef = useRef<string | null>(null);
  const currentTeamRef = useRef<string | null>(null);
  const messageHandlerRef = useRef<MessageHandler | null>(null);
  const onOpenHandlerRef = useRef<(() => void) | null>(null);
  const onCloseHandlerRef = useRef<(() => void) | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const heartbeatTimeoutRef = useRef<number | null>(null);
  const lastSeenRef = useRef<number>(Date.now());
  const reconnectAttemptRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const shouldReconnectRef = useRef<boolean>(false);

  const safeParse = async (data: any): Promise<any> => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        // try to extract JSON substring (in case server wraps it)
        const match = data.match?.(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch {}
        }
        return null;
      }
    } else if (data instanceof Blob) {
      const text = await data.text();
      return safeParse(text);
    } else if (data instanceof ArrayBuffer) {
      const text = new TextDecoder().decode(data);
      return safeParse(text);
    }
    return data;
  };

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      window.clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      window.clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback((socket: WebSocket) => {
    stopHeartbeat();
    lastSeenRef.current = Date.now();

    heartbeatIntervalRef.current = window.setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN) return;

      try {
        socket.send(JSON.stringify({ action: "ping" }));
        
        // schedule timeout check
        heartbeatTimeoutRef.current = window.setTimeout(() => {
          if (Date.now() - lastSeenRef.current > HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT) {
            console.warn("WebSocket heartbeat missed — closing socket");
            try {
              socket.close();
            } catch {}
          }
        }, HEARTBEAT_TIMEOUT);
      } catch (err) {
        console.error("Heartbeat send failed", err);
      }
    }, HEARTBEAT_INTERVAL);
  }, [stopHeartbeat]);

  const attemptReconnect = useCallback(() => {
    if (!shouldReconnectRef.current || !currentRoomRef.current) return;

    const room = currentRoomRef.current;
    const maxAttempts = 5;
    const baseDelay = 1000;

    if (reconnectAttemptRef.current >= maxAttempts) {
      console.error(`Failed to reconnect after ${maxAttempts} attempts`);
      shouldReconnectRef.current = false;
      reconnectAttemptRef.current = 0;
      onCloseHandlerRef.current?.();
      return;
    }

    reconnectAttemptRef.current += 1;
    const delay = baseDelay * Math.pow(2, reconnectAttemptRef.current - 1);

    console.info(
      `Attempting reconnect ${reconnectAttemptRef.current}/${maxAttempts} in ${delay}ms...`
    );

    reconnectTimeoutRef.current = window.setTimeout(() => {
      if (!shouldReconnectRef.current) return;

      const url = `${baseUrl}/${encodeURIComponent(room)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.addEventListener("open", () => {
        console.info("WebSocket reconnected to", url);
        reconnectAttemptRef.current = 0;
        startHeartbeat(ws);
        
        // Send reconnect action to server after reconnecting
        try {
          const reconnectPayload: any = { action: "reconnect" };
          if (currentTeamRef.current) {
            reconnectPayload.team = currentTeamRef.current;
            console.info("Sent reconnect action with team:", currentTeamRef.current);
          } else {
            console.info("Sent reconnect action (no team stored)");
          }
          ws.send(JSON.stringify(reconnectPayload));
        } catch (err) {
          console.error("Failed to send reconnect action", err);
        }
        
        onOpenHandlerRef.current?.();
      });

      ws.addEventListener("message", async (ev) => {
        console.debug("WS raw message:", ev.data, "typeof:", typeof ev.data);

        const payload = await safeParse(ev.data);

        if (payload !== null) {
          lastSeenRef.current = Date.now();
          if (heartbeatTimeoutRef.current) {
            window.clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
          }

          if (payload.action === "pong" || payload.type === "pong") {
            console.debug("Received heartbeat pong");
            return;
          }

          messageHandlerRef.current?.(payload);
        } else {
          console.debug("WS message: could not parse payload, skipping", ev.data);
        }
      });

      ws.addEventListener("close", (ev) => {
        console.warn("WebSocket closed during reconnect", ev.code, ev.reason);
        stopHeartbeat();

        if (wsRef.current === ws) {
          wsRef.current = null;
        }

        // Try again if still should reconnect
        if (shouldReconnectRef.current) {
          attemptReconnect();
        } else {
          onCloseHandlerRef.current?.();
        }
      });

      ws.addEventListener("error", (e) => {
        console.error("WebSocket reconnect error", e);
      });
    }, delay);
  }, [baseUrl, safeParse, startHeartbeat, stopHeartbeat]);

  const connect = useCallback(
    (
      room: string,
      onMessage?: MessageHandler,
      onOpen?: () => void,
      onClose?: () => void
    ) => {
      // Store handlers for reconnection
      messageHandlerRef.current = onMessage || null;
      onOpenHandlerRef.current = onOpen || null;
      onCloseHandlerRef.current = onClose || null;
      shouldReconnectRef.current = true;
      reconnectAttemptRef.current = 0;

      // Clear any pending reconnect attempts
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // reuse existing socket if already connected to same room
      if (
        wsRef.current &&
        currentRoomRef.current === room &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        console.info("WebSocket already connected to", room);
        return;
      }

      // close previous socket if different
      if (wsRef.current) {
        shouldReconnectRef.current = false; // don't reconnect old socket
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
        currentRoomRef.current = null;
      }

      const url = `${baseUrl}/${encodeURIComponent(room)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      currentRoomRef.current = room;
      shouldReconnectRef.current = true;

      ws.addEventListener("open", () => {
        console.info("WebSocket connected to", url);
        reconnectAttemptRef.current = 0;
        startHeartbeat(ws);
        onOpen?.();
      });

      ws.addEventListener("message", async (ev) => {
        console.debug("WS raw message:", ev.data, "typeof:", typeof ev.data);

        const payload = await safeParse(ev.data);
        
        if (payload !== null) {
          // update heartbeat timestamp on any incoming message
          lastSeenRef.current = Date.now();
          if (heartbeatTimeoutRef.current) {
            window.clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
          }

          // handle pong responses (optional - server can send { action: "pong" })
          if (payload.action === "pong" || payload.type === "pong") {
            console.debug("Received heartbeat pong");
            return;
          }

          messageHandlerRef.current?.(payload);
        } else {
          console.debug("WS message: could not parse payload, skipping", ev.data);
        }
      });

      ws.addEventListener("close", (ev) => {
        console.warn("WebSocket closed", ev.code, ev.reason, "for", room);
        stopHeartbeat();
        
        // clear refs
        if (wsRef.current === ws) {
          wsRef.current = null;
        }

        // Attempt reconnection if enabled
        if (shouldReconnectRef.current && currentRoomRef.current) {
          console.info("Connection lost, attempting to reconnect...");
          attemptReconnect();
        } else {
          currentRoomRef.current = null;
          onClose?.();
        }
      });

      ws.addEventListener("error", (e) => {
        console.error("WebSocket error", e);
      });
    },
    [baseUrl, safeParse, startHeartbeat, stopHeartbeat, attemptReconnect]
  );

  const send = useCallback((obj: any) => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(obj));
      } else {
        console.warn("WebSocket not open, cannot send", obj);
      }
    } catch (err) {
      console.error("Failed to send over WebSocket", err);
    }
  }, []);

  const reconnect = useCallback((team?: string) => {
    if (team) {
      currentTeamRef.current = team;
    }
    const payload: any = { action: "reconnect" };
    if (team || currentTeamRef.current) {
      payload.team = team || currentTeamRef.current;
    }
    send(payload);
  }, [send]);

  const setTeam = useCallback((team: string) => {
    currentTeamRef.current = team;
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    stopHeartbeat();
    
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    try {
      wsRef.current?.close();
    } catch {}
    wsRef.current = null;
    currentRoomRef.current = null;
    reconnectAttemptRef.current = 0;
  }, [stopHeartbeat]);

  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      stopHeartbeat();
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
      currentRoomRef.current = null;
    };
  }, [stopHeartbeat]);

  return { connect, disconnect, send, reconnect, setTeam, getSocket: () => wsRef.current };
}
