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

    // Generar logs basados en cambios de estado o posiciones (Simulado por ahora)
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      msg: `Tick recibido: PNL ${data.net_pnl.toFixed(4)} SOL | Ping ${data.rpc_ping}ms`,
      type: 'info'
    };

    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">System Terminal</h2>
      <div 
        ref={scrollRef}
        className="h-32 w-full bg-black border border-white/5 rounded-lg p-3 font-mono text-[10px] overflow-y-auto flex flex-col gap-1 scrollbar-hide"
      >
        {logs.length === 0 && <span className="text-gray-700 animate-pulse">ESPERANDO SEÑAL DE ENLACE...</span>}
        {logs.map(log => (
          <div key={log.id} className="flex gap-3 border-l border-white/5 pl-2">
            <span className="text-gray-600 shrink-0">[{log.time}]</span>
            <span className={
              log.type === 'success' ? 'text-green-500' :
              log.type === 'error' ? 'text-red-500' :
              log.type === 'warn' ? 'text-yellow-500' : 'text-blue-400'
            }>
              {log.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
