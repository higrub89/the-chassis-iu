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
  net_pnl?: number;
  pnl?: number;
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
  setConnectionStatus: (status) => {
    set({ connected: status })
    if (!status && typeof window !== 'undefined') {
      document.title = 'The Chassis - OFFLINE';
    }
  },
  updateTelemetry: (tick) => set((state) => {
    const activePnl = tick.pnl ?? tick.net_pnl ?? 0;
    const timeStr = new Date(tick.t * 1000).toLocaleTimeString([], { hour12: false });
    const newHistory = [...state.history, { time: timeStr, pnl: activePnl, ping: tick.rpc_ping }].slice(-60);

    // Dynamic Tab-Tracking (Observability in Background)
    if (typeof window !== 'undefined') {
      const hasCritical = tick.positions.some(p => (((p.current - p.sl_level) / (p.entry - p.sl_level)) * 100) < 20);
      const isTrading = tick.positions.length > 0;

      let title = 'The Chassis - Stable';
      if (hasCritical) {
        title = '🔴 [CRITICAL] YIELD FATAL';
      } else if (isTrading) {
        const winning = tick.positions.filter(p => p.yield_pct > 0).length;
        const total = tick.positions.length;
        const netPnlStr = activePnl >= 0 ? `+${activePnl.toFixed(2)}` : activePnl.toFixed(2);
        title = `🟢 ${netPnlStr} SOL | ${winning}/${total} Win`;
      }

      document.title = title;
    }

    return { data: { ...tick, net_pnl: activePnl }, history: newHistory };
  }),
}));
