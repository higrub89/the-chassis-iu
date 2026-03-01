import { create } from 'zustand';

export interface Position {
  mint: string;
  symbol: string;
  entry: number;
  current: number;
  yield_pct: number;
  sl_level: number;
}

export interface TelemetryTick {
  t: number;
  net_pnl: number;
  rpc_ping: number;
  status: string;
  positions: Position[];
}

interface TelemetryState {
  connected: boolean;
  data: TelemetryTick | null;
  sendCommand: (cmd: string) => void;
  registerSender: (fn: (cmd: string) => void) => void;
  setConnectionStatus: (status: boolean) => void;
  updateTelemetry: (tick: TelemetryTick) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  connected: false,
  data: null,
  sendCommand: () => console.warn("[ECU] Transmisor offline. Enlace roto."),
  registerSender: (fn) => set({ sendCommand: fn }),
  setConnectionStatus: (status) => set({ connected: status }),
  updateTelemetry: (tick) => set({ data: tick }),
}));
