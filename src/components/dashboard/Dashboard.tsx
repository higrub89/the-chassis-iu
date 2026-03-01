'use client';

import { ConnectionStatus } from './ConnectionStatus';
import { TelemetryMetrics } from './TelemetryMetrics';
import { PositionsTable } from './PositionsTable';
import { TelemetryProvider } from '../telemetry/TelemetryProvider';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      {/* Telemetry WebSocket Logic (No UI) */}
      <TelemetryProvider />

      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-black uppercase tracking-tighter text-blue-500">The Chassis UI</h1>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Sistema de Telemetría v1.0.0-beta</p>
          </div>
          <ConnectionStatus />
        </div>

        {/* Real-time Metrics */}
        <TelemetryMetrics />

        {/* Positions Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Posiciones Activas</h2>
          <PositionsTable />
        </div>

        {/* Terminal/Footer Placeholder */}
        <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-600 font-mono uppercase tracking-widest">
          <span>Control de Enlace: Activo</span>
          <span>© 2026 The Chassis Project</span>
        </div>
      </div>
    </div>
  );
}
