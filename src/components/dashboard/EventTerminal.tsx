'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useEffect, useState, useRef } from 'react';

interface LogEntry {
  id: string;
  time: string;
  msg: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export function EventTerminal() {
  const data = useTelemetryStore((state) => state.data);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;

    // Generar logs hiper-técnicos en inglés simulando análisis HFT de las posiciones
    const logTypes: ('info' | 'warn' | 'success')[] = ['info', 'info', 'info', 'success', 'warn'];
    const selectedType = logTypes[Math.floor(Math.random() * logTypes.length)];

    const netPnl = data.net_pnl ?? 0;
    let msg = `TICK_RCV: Pnl[${netPnl.toFixed(4)}] Ping[${data.rpc_ping}ms]`;
    if (selectedType === 'success') {
      msg = `[PROFIT_SYNC] Net Pnl increment detected. Retaining asset matrix.`;
    } else if (selectedType === 'warn') {
      msg = `[RISK_ANALYSIS] Elevated slippage or volatility detected in pool.`;
    }

    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      msg: msg,
      type: selectedType
    };

    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-2 relative">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-500/80 px-1 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] flex items-center gap-2">
        <span className="w-2 h-2 border border-cyan-500 rounded-sm inline-block animate-[spin_3s_linear_infinite]" />
        System Terminal
      </h2>
      <div
        ref={scrollRef}
        className="h-[200px] w-full bg-[#030303]/80 backdrop-blur-3xl border border-white/10 shadow-[inner_0_0_20px_rgba(0,150,255,0.05),0_0_30px_rgba(0,0,0,0.5)] rounded-xl p-4 font-mono text-[10px] overflow-y-auto flex flex-col gap-1.5 scrollbar-hide relative group"
      >
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 z-10" />

        {logs.length === 0 && <span className="text-cyan-800 animate-pulse tracking-widest z-0">AWAITING_UPLINK_DATA_STREAM...</span>}

        {logs.map(log => (
          <div key={log.id} className="flex gap-4 border-l-2 border-cyan-500/20 pl-3 relative z-0 group-hover:border-cyan-500/50 transition-colors">
            <span className="text-cyan-800 shrink-0 w-[60px]">{log.time}</span>
            <span className={`tracking-widest ${log.type === 'success' ? 'text-green-400 drop-shadow-[0_0_5px_currentColor]' :
              log.type === 'error' ? 'text-red-500 drop-shadow-[0_0_5px_currentColor]' :
                log.type === 'warn' ? 'text-orange-400 drop-shadow-[0_0_5px_currentColor]' : 'text-cyan-300 drop-shadow-[0_0_5px_currentColor]'
              }`}>
              <span className="mr-2 opacity-50">{'>'}</span>{log.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
