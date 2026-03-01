'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';

export function TelemetryMetrics() {
  const data = useTelemetryStore((state) => state.data);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Tarjeta de PNL */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">PNL Neto</span>
        <div className={`text-2xl font-mono ${data.net_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {data.net_pnl >= 0 ? '+' : ''}{data.net_pnl.toFixed(2)} SOL
        </div>
      </div>

      {/* Tarjeta de Latencia */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 flex flex-col gap-1 text-right">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Latencia RPC</span>
        <div className={`text-2xl font-mono ${data.rpc_ping < 100 ? 'text-blue-400' : 'text-yellow-400'}`}>
          {data.rpc_ping}ms
        </div>
      </div>
    </div>
  );
}
