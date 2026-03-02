'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useState } from 'react';

export function PositionsTable() {
  const data = useTelemetryStore((state) => state.data);
  const [copied, setCopied] = useState<string | null>(null);

  const formatMint = (mint: string) => {
    return `${mint.slice(0, 4)}...${mint.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!data || data.positions.length === 0) {
    return (
      <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-gray-500 text-sm font-mono uppercase tracking-widest">
        No hay posiciones activas
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
      <table className="w-full text-left text-[11px] font-mono border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 uppercase text-gray-400">
            <th className="p-3 font-bold tracking-tighter">Asset</th>
            <th className="p-3 text-right">Entrada / Actual</th>
            <th className="p-3 text-center">Rendimiento</th>
            <th className="p-3 text-right">Stop Loss</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.positions.map((pos) => {
            const riskPct = ((pos.current - pos.sl_level) / (pos.entry - pos.sl_level)) * 100;
            const isCritical = riskPct < 20;

            return (
              <tr key={pos.mint} className="hover:bg-white/5 transition-colors group">
                <td className="p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-blue-400 text-xs">{pos.symbol}</span>
                    <button 
                      onClick={() => copyToClipboard(pos.mint)}
                      className="text-[9px] text-gray-500 hover:text-white transition-colors text-left flex items-center gap-1 group-hover:opacity-100 opacity-60"
                    >
                      {formatMint(pos.mint)}
                      {copied === pos.mint ? '✓' : '❐'}
                    </button>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex flex-col">
                    <span className="text-gray-500">{pos.entry.toFixed(6)}</span>
                    <span className="text-white font-bold">{pos.current.toFixed(6)}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex justify-center">
                    <span className={`px-2 py-1 rounded-md font-black text-xs min-w-[60px] text-center ${
                      pos.yield_pct >= 0 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/20'
                    }`}>
                      {pos.yield_pct >= 0 ? '+' : ''}{pos.yield_pct.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`italic ${isCritical ? 'text-red-400 animate-pulse' : 'text-orange-400/80'}`}>
                      {pos.sl_level.toFixed(6)}
                    </span>
                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.max(0, Math.min(100, riskPct))}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
