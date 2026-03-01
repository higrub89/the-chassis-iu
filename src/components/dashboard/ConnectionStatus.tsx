'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';

export function ConnectionStatus() {
  const connected = useTelemetryStore((state) => state.connected);

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
      <span className={`text-xs font-mono uppercase tracking-wider ${connected ? 'text-green-400' : 'text-red-400'}`}>
        {connected ? 'Enlace Estable' : 'Reconectando...'}
      </span>
    </div>
  );
}
