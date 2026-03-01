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
  wallet_balance?: number;
  sol_price?: number;
  status: string;
  positions: Position[];
}

interface TelemetryState {
  connected: boolean;
  data: TelemetryTick | null;
  history: { time: string; pnl: number; ping: number }[];
  sendCommand: (cmd: string) => void;
  registerSender: (fn: (cmd: string) => void) => void;
  setConnectionStatus: (status: boolean) => void;
  updateTelemetry: (tick: TelemetryTick) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  connected: false,
  data: null,
  history: [],
  sendCommand: () => console.warn("[ECU] Transmisor offline. Enlace roto."),
  registerSender: (fn) => set({ sendCommand: fn }),
  setConnectionStatus: (status) => set({ connected: status }),
  updateTelemetry: (tick) => set((state) => {
    const timeStr = new Date(tick.t * 1000).toLocaleTimeString([], { hour12: false });
    const newHistory = [...state.history, { time: timeStr, pnl: tick.net_pnl, ping: tick.rpc_ping }].slice(-60);
    return { data: tick, history: newHistory };
  }),
}));
