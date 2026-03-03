'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';

export function TelemetryMetrics() {
  const data = useTelemetryStore((state) => state.data);

  if (!data) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/5" />
      ))}
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RUNNING': case 'TRADING': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'IDLE': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'STOPPED': case 'EMERGENCY': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const netPnl = data.net_pnl ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Tarjeta de PNL */}
      <div className="p-5 rounded-2xl bg-[#030303]/60 backdrop-blur-3xl border border-white/10 flex flex-col gap-1 relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1">
        <div className={`absolute -inset-1 opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40 ${netPnl >= 0 ? 'bg-cyan-500' : 'bg-red-500'}`} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold relative z-10 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className={`w-1 h-3 rounded-full ${netPnl >= 0 ? 'bg-cyan-500' : 'bg-red-500'}`} />
            NET PNL EARNINGS
          </span>
          {/* Pnl Micro-Distribution */}
          <div className="flex gap-0.5 w-16 h-1.5 opacity-60">
            {data.positions.length > 0 ? (
              data.positions.map((p, i) => (
                <div key={i} className={`flex-1 rounded-sm ${p.yield_pct >= 0 ? 'bg-cyan-400' : 'bg-red-500'}`} />
              ))
            ) : (
              <div className="flex-1 bg-white/10 rounded-sm" />
            )}
          </div>
        </span>
        <div className={`text-2xl font-mono font-black mt-2 relative z-10 drop-shadow-[0_0_10px_currentColor] ${netPnl >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
          {netPnl >= 0 ? '+' : ''}{netPnl.toFixed(4)} SOL
        </div>
      </div>

      {/* Wallet Balance + SOL Price */}
      <div className="p-5 rounded-2xl bg-[#030303]/60 backdrop-blur-3xl border border-white/10 flex flex-col gap-1 relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1">
        <div className="absolute -inset-1 opacity-10 bg-blue-500 blur-2xl transition-all duration-500 group-hover:opacity-30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold relative z-10 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-blue-500" />
            WALLET BALANCE
          </span>
          <span className="text-[9px] text-blue-400/80 font-mono tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            SOL = ${data.sol_price?.toFixed(2) || '---'}
          </span>
        </span>
        <div className="text-2xl font-mono font-black text-white mt-2 relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          {data.wallet_balance?.toFixed(3) || '0.000'} <span className="text-xs text-blue-300/50">SOL</span>
        </div>
      </div>

      {/* System Status */}
      <div className="p-5 rounded-2xl bg-[#030303]/60 backdrop-blur-3xl border border-white/10 flex flex-col justify-between gap-1 relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold relative z-10 flex items-center gap-2">
          <span className="w-1 h-3 rounded-full bg-gray-500" />
          SYSTEM STATE
        </span>
        <div className={`mt-2 px-3 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-[0.1em] w-fit shadow-[0_0_15px_currentColor] relative z-10 ${getStatusColor(data.status)}`}>
          {data.status}
        </div>
      </div>
    </div>
  );
}
