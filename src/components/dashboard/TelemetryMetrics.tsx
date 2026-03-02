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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Tarjeta de PNL */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 flex flex-col gap-1 relative overflow-hidden group">
        <div className={`absolute inset-0 opacity-10 blur-2xl transition-opacity group-hover:opacity-20 ${data.net_pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">PNL Neto</span>
        <div className={`text-xl font-mono font-black ${data.net_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {data.net_pnl >= 0 ? '+' : ''}{data.net_pnl.toFixed(4)} SOL
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Balance</span>
        <div className="text-xl font-mono font-black text-white">
          {data.wallet_balance?.toFixed(3) || '0.000'} <span className="text-[10px] text-gray-500">SOL</span>
        </div>
      </div>

      {/* SOL Price */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">SOL Price</span>
        <div className="text-xl font-mono font-black text-blue-400">
          ${data.sol_price?.toFixed(2) || '---'}
        </div>
      </div>

      {/* System Status */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Estado</span>
        <div className={`mt-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tighter w-fit ${getStatusColor(data.status)}`}>
          {data.status}
        </div>
      </div>
    </div>
  );
}
