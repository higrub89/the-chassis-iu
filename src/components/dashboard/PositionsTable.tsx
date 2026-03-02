'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useState } from 'react';

export function PositionsTable() {
  const data = useTelemetryStore((state) => state.data);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'WINNING' | 'CRITICAL'>('ALL');

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
      <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-cyan-800 text-sm font-mono uppercase tracking-widest animate-pulse">
        AWAITING_MARKET_DATA...
      </div>
    );
  }

  const criticalCount = data.positions.filter(p => (((p.current - p.sl_level) / (p.entry - p.sl_level)) * 100) < 20).length;
  const winningCount = data.positions.filter(p => p.yield_pct > 0).length;

  const filteredPositions = data.positions.filter(pos => {
    if (filter === 'ALL') return true;
    if (filter === 'WINNING') return pos.yield_pct > 0;
    if (filter === 'CRITICAL') return (((pos.current - pos.sl_level) / (pos.entry - pos.sl_level)) * 100) < 20;
    return true;
  });

  return (
    <div className="w-full relative">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] transition-all ${filter === 'ALL' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'}`}
        >
          ALL [{data.positions.length}]
        </button>
        <button
          onClick={() => setFilter('WINNING')}
          className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] transition-all ${filter === 'WINNING' ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'}`}
        >
          WINNING [{winningCount}]
        </button>
        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] transition-all ${filter === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'} ${criticalCount > 0 && filter !== 'CRITICAL' ? 'animate-pulse text-red-400' : ''}`}
        >
          CRITICAL [{criticalCount}]
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#030303]/60 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
          <table className="w-full text-left text-[11px] font-mono border-collapse relative">
            <thead className="sticky top-0 z-20 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 shadow-md">
              <tr className="uppercase text-gray-500 tracking-[0.2em]">
                <th className="p-4 font-black">Asset Identifier</th>
                <th className="p-4 text-right">Entry / Current Rate</th>
                <th className="p-4 text-center">Net Yield</th>
                <th className="p-4 text-right">Hard Stop Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative z-10">
              {filteredPositions.map((pos) => {
                const riskPct = ((pos.current - pos.sl_level) / (pos.entry - pos.sl_level)) * 100;
                const isCritical = riskPct < 20;

                return (
                  <tr key={pos.mint} className={`hover:bg-white/[0.03] transition-colors group relative overflow-hidden ${isCritical ? 'bg-red-950/10' : ''}`}>
                    {isCritical && (
                      <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                    )}
                    <td className="p-4 relative">
                      <div className={`absolute inset-y-0 left-0 w-1 transition-colors ${isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-transparent group-hover:bg-cyan-500'}`} />
                      <div className="flex flex-col gap-0.5 pl-2">
                        <span className="font-black text-cyan-400 text-sm tracking-[0.1em] drop-shadow-[0_0_8px_currentColor]">{pos.symbol}</span>
                        <button
                          onClick={() => copyToClipboard(pos.mint)}
                          className="text-[9px] text-gray-500 hover:text-white transition-colors text-left flex items-center gap-2 group-hover:opacity-100 opacity-60 tracking-widest relative z-10"
                        >
                          {formatMint(pos.mint)}
                          {copied === pos.mint ? <span className="text-green-400">✓</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity">❐</span>}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-gray-500 tracking-widest">{pos.entry.toFixed(6)}</span>
                        <span className="text-white font-bold tracking-widest flex items-center justify-end gap-2">
                          {pos.current > pos.entry ? <span className="text-[8px] text-green-400 animate-pulse">▲</span> : <span className="text-[8px] text-red-500">▼</span>}
                          {pos.current.toFixed(6)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 relative z-10">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1.5 rounded-lg font-black text-xs min-w-[70px] text-center shadow-[0_0_10px_currentColor] ${pos.yield_pct >= 0
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                          {pos.yield_pct >= 0 ? '+' : ''}{pos.yield_pct.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right relative z-10">
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`italic tracking-widest ${isCritical ? 'text-red-400 font-bold drop-shadow-[0_0_8px_currentColor]' : 'text-orange-400/80'}`}>
                          {pos.sl_level.toFixed(6)}
                        </span>
                        <div className="w-20 h-1 bg-[#111] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                          <div
                            className={`h-full transition-all duration-500 rounded-full shadow-[0_0_5px_currentColor] ${isCritical ? 'bg-red-500' : 'bg-orange-500'}`}
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
      </div>
    </div>
  );
}
