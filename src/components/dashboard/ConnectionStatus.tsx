'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';

export function ConnectionStatus() {
  const connected = useTelemetryStore((state) => state.connected);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#030303]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-red-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] relative top-[1px] ${connected ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]' : 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]'}`}>
        {connected ? 'UPLINK_SECURE' : 'AWAITING_SIGNAL'}
      </span>
    </div>
  );
}
