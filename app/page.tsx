'use client';

import { ConnectionStatus } from '../src/components/dashboard/ConnectionStatus';
import { TelemetryMetrics } from '../src/components/dashboard/TelemetryMetrics';
import { PositionsTable } from '../src/components/dashboard/PositionsTable';
import { TelemetryProvider } from '../src/components/telemetry/TelemetryProvider';
import { TelemetryChart } from '../src/components/telemetry/TelemetryChart';
import { EventTerminal } from '../src/components/dashboard/EventTerminal';
import { useTelemetryStore } from '../src/store/useTelemetryStore';
import { AlertOctagon, PowerOff } from 'lucide-react';

export default function Home() {
  const { sendCommand } = useTelemetryStore();

  const handlePanic = () => {
    sendCommand(JSON.stringify({ command: "PANIC_ALL", timestamp: Date.now() }));
  };

  const handleHibernate = () => {
    sendCommand(JSON.stringify({ command: "HIBERNATE", timestamp: Date.now() }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Telemetry WebSocket Logic (No UI) */}
      <TelemetryProvider />

      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-blue-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              The Chassis UI
            </h1>
            <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">
              TELEMETRÍA DE ALTA PRECISIÓN <span className="text-white/20 px-2">//</span> v1.0.0-beta
            </p>
          </div>
          <ConnectionStatus />
        </div>

        {/* Real-time Metrics Grid */}
        <TelemetryMetrics />

        {/* Chart & Terminal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-900/40 border border-white/5 flex flex-col gap-4 min-h-[350px]">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">PNL Histórico & Latencia</h2>
              <div className="flex gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> PNL</span>
                <span className="flex items-center gap-1.5 text-blue-400"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Ping</span>
              </div>
            </div>
            <div className="flex-1 w-full h-full min-h-[250px]">
              <TelemetryChart />
            </div>
          </div>

          {/* Terminal Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <EventTerminal />
            
            {/* Tactical Command Center */}
            <div className="p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-sm flex flex-col gap-4">
              <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Command Center</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handlePanic}
                  className="bg-red-950/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 px-4 py-2.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <AlertOctagon size={14} className="group-hover:scale-110 transition-transform" />
                  PANIC_ALL
                </button>

                <button
                  onClick={handleHibernate}
                  className="bg-yellow-950/20 hover:bg-yellow-900/40 text-yellow-500 border border-yellow-900/30 px-4 py-2.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <PowerOff size={14} className="group-hover:scale-110 transition-transform" />
                  HIBERNATE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Positions Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Posiciones de Mercado Activas</h2>
            <div className="flex gap-4 items-center">
               <span className="text-[10px] font-mono text-white/20">LIVE_FEED_STREAMING</span>
               <div className="flex gap-1">
                 <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                 <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          </div>
          <PositionsTable />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-600 font-mono uppercase tracking-[0.3em]">
          <span>LINK_STATE: STABLE_SYNC</span>
          <span className="text-white/10 hidden md:block tracking-widest">SYSTEM_PROTOCOL_ACX_99</span>
          <span>© 2026 THE CHASSIS PROJECT</span>
        </div>
      </div>
    </div>
  );
}
