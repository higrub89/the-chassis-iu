'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { TelemetryTickSchema } from '../../schema/telemetry';

const WS_URL = process.env.NEXT_PUBLIC_TELEMETRY_WS_URL || 'ws://127.0.0.1:9001';
const RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export function TelemetryProvider() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const backoffDelay = useRef(RECONNECT_DELAY);
  const { setConnectionStatus, updateTelemetry, registerSender } = useTelemetryStore();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;

    console.log(`📡 Conectando a telemetría: ${WS_URL}`);
    try {
      ws.current = new WebSocket(WS_URL);
    } catch (error) {
      console.error("❌ Excepción al instanciar WebSocket (posible bloqueo por Mixed Content SSL):", error);
      return;
    }

    ws.current.onopen = () => {
      console.log('✅ Conexión establecida');
      setConnectionStatus(true);
      backoffDelay.current = RECONNECT_DELAY; // Reset on success

      registerSender((cmd: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(cmd);
          console.log(`[TX] ⚡ Señal táctica inyectada: ${cmd}`);
        }
      });
    };

    ws.current.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        const result = TelemetryTickSchema.safeParse(rawData);

        if (result.success) {
          updateTelemetry(result.data);
        } else {
          console.error("⚠️ Telemetría corrupta detectada:", result.error.format());
        }
      } catch (error) {
        console.error("Ruido en la línea de telemetría", error);
      }
    };

    ws.current.onclose = (event) => {
      setConnectionStatus(false);

      // Don't reconnect if it was a deliberate close (e.g. unmount)
      if (event.wasClean) {
        console.log('🔌 Conexión cerrada limpiamente.');
        return;
      }

      console.warn(`⚠️ Conexión interrumpida. Reintentando en ${backoffDelay.current}ms...`);

      reconnectTimeout.current = setTimeout(() => {
        connect();
        // Exponential backoff
        backoffDelay.current = Math.min(backoffDelay.current * 2, MAX_RECONNECT_DELAY);
      }, backoffDelay.current);
    };

    ws.current.onerror = (err) => {
      console.error("❌ Error en el enlace de telemetría:", err);
      // Let onclose handle the reconnection
      ws.current?.close();
    };
  }, [setConnectionStatus, updateTelemetry, registerSender]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        // Disable onclose to prevent reconnect loop while unmounting
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  return null;
}
