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
    <div className="min-h-screen bg-transparent text-white p-4 md:p-8 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,183,255,0.07),rgba(255,255,255,0))]" />

      {/* Telemetry WebSocket Logic (No UI) */}
      <TelemetryProvider />

      <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,200,255,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              THE CHASSIS
            </h1>
            <p className="text-[10px] text-gray-500 uppercase font-mono tracking-[0.3em]">
              HIGH PRECISION TELEMETRY <span className="text-white/20 px-2">//</span> v1.0.0-beta
            </p>
          </div>
          <ConnectionStatus />
        </div>

        {/* Real-time Metrics Grid */}
        <TelemetryMetrics />

        {/* Chart & Terminal Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <div className="xl:col-span-2 p-6 rounded-2xl bg-[#030303]/60 backdrop-blur-3xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 min-h-[400px]">
            <div className="flex justify-between items-center px-1 border-b border-white/5 pb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Yield History & Latency</h2>
              <div className="flex gap-4 text-[10px] font-mono tracking-widest">
                <span className="flex items-center gap-1.5 text-cyan-400"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_currentColor]" /> PNL</span>
                <span className="flex items-center gap-1.5 text-blue-500"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PING</span>
              </div>
            </div>
            <div className="flex-1 w-full h-full min-h-[300px]">
              <TelemetryChart />
            </div>
          </div>

          {/* Terminal Sidebar */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <EventTerminal />

            {/* Tactical Command Center */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#030303]/60 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] relative z-10 flex items-center gap-2">
                <span className="w-1 h-3 bg-red-500 rounded-full" />
                Command Center
              </h3>

              <div className="grid grid-cols-1 gap-3 relative z-10">
                <button
                  onClick={handlePanic}
                  className="bg-red-950/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-4 py-3 rounded-lg text-[10px] font-black tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <AlertOctagon size={16} className="group-hover/btn:scale-110 group-hover/btn:animate-pulse transition-transform" />
                  PANIC_ALL
                </button>

                <button
                  onClick={handleHibernate}
                  className="bg-orange-950/20 hover:bg-orange-900/40 text-orange-500 border border-orange-900/50 px-4 py-3 rounded-lg text-[10px] font-black tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                >
                  <PowerOff size={16} className="group-hover/btn:scale-110 transition-transform" />
                  HIBERNATE MODULE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Positions Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-center px-1 border-b border-white/5 pb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Active Market Positions</h2>
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-mono text-cyan-500/50 tracking-widest">LIVE_FEED_STREAMING</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_5px_currentColor]" />
                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_5px_currentColor]" />
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
          <PositionsTable />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-600 font-mono uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> LINK_STATE: STABLE_SYNC
          </span>
          <span className="text-white/10 hidden md:block tracking-widest">SYSTEM_PROTOCOL_ACX_99</span>
          <span className="text-cyan-900/50">© 2026 THE CHASSIS PROJECT</span>
        </div>
      </div>
    </div>
  );
}
