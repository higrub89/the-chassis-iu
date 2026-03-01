'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';

export function PositionsTable() {
  const data = useTelemetryStore((state) => state.data);

  if (!data || data.positions.length === 0) {
    return (
      <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-gray-500 text-sm font-mono uppercase tracking-widest">
        No hay posiciones activas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 uppercase text-gray-400">
            <th className="p-3">Asset (Mint)</th>
            <th className="p-3 text-right">Entrada</th>
            <th className="p-3 text-right">Actual</th>
            <th className="p-3 text-right">PNL %</th>
            <th className="p-3 text-right">SL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.positions.map((pos) => (
            <tr key={pos.mint} className="hover:bg-white/5 transition-colors">
              <td className="p-3 truncate max-w-[120px] font-bold text-blue-300">{pos.mint}</td>
              <td className="p-3 text-right text-gray-300">{pos.entry.toFixed(6)}</td>
              <td className="p-3 text-right text-gray-100">{pos.current.toFixed(6)}</td>
              <td className={`p-3 text-right font-bold ${pos.yield_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pos.yield_pct >= 0 ? '+' : ''}{pos.yield_pct.toFixed(2)}%
              </td>
              <td className="p-3 text-right text-orange-400/80 italic">{pos.sl_level.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
