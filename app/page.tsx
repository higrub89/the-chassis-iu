'use client';

import { useTelemetryStore } from '../src/store/useTelemetryStore';
import { TelemetryProvider } from '../src/components/telemetry/TelemetryProvider';
import { TelemetryChart } from '../src/components/telemetry/TelemetryChart';
import { Zap, ShieldAlert, AlertOctagon, PowerOff } from 'lucide-react';

export default function Dashboard() {
  const { connected, data, sendCommand } = useTelemetryStore();

  const handlePanic = () => {
    sendCommand(JSON.stringify({ command: "PANIC_ALL", timestamp: Date.now() }));
  };

  const handleHibernate = () => {
    sendCommand(JSON.stringify({ command: "HIBERNATE", timestamp: Date.now() }));
  };

  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-mono p-8 selection:bg-gray-800">
      <TelemetryProvider />

      <header className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
        <div className="flex items-center gap-4">
          <div className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-600'}`} />
          <h1 className="text-sm tracking-widest text-gray-400">THE CHASSIS <span className="text-white">TELEMETRY</span></h1>
        </div>

        <div className="flex items-center gap-6 text-xs tracking-wider">
          <div className="flex items-center gap-2">
            <Zap size={14} className={data?.rpc_ping && data.rpc_ping > 200 ? 'text-red-500' : 'text-emerald-500'} />
            <span>RPC: {data?.rpc_ping || '---'} ms</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className={data?.status === 'ARMED' ? 'text-emerald-500' : 'text-yellow-500'} />
            <span>SYS: {data?.status || 'OFFLINE'}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-sm flex flex-col justify-center">
          <p className="text-xs text-gray-500 mb-2 tracking-widest flex items-center justify-between">
            WALLET BALANCE
            {data?.sol_price ? <span className="text-[10px] text-emerald-500 bg-emerald-950/30 border border-emerald-900/50 px-2 py-0.5 rounded-sm">${data.sol_price.toFixed(2)}/SOL</span> : null}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-light text-white flex items-end gap-2">
              {data?.wallet_balance !== undefined ? data.wallet_balance.toFixed(4) : '0.0000'}
              <span className="text-base text-gray-600 mb-1">SOL</span>
            </p>
          </div>
          {data?.wallet_balance !== undefined && data?.sol_price !== undefined && (
            <p className="text-[11px] text-gray-500 mt-2 tracking-widest">
              ≈ ${(data.wallet_balance * data.sol_price).toFixed(2)} USD
            </p>
          )}
        </div>

        <div className="bg-[#0a0a0a] border border-gray-900 p-6 rounded-sm flex flex-col justify-center">
          <p className="text-xs text-gray-500 mb-2 tracking-widest">NET PNL (SOL)</p>
          <p className={`text-4xl font-light ${data?.net_pnl && data.net_pnl < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {data?.net_pnl ? data.net_pnl.toFixed(9) : '0.000000000'}
          </p>
        </div>

        <div className="md:col-span-2 bg-[#0a0a0a] border border-gray-900 p-6 rounded-sm h-[200px]">
          <h2 className="text-[10px] text-gray-600 mb-4 tracking-widest uppercase flex justify-between">
            <span>REAL-TIME NET PNL & LATENCY</span>
            <div className="flex gap-4">
              <span className="text-emerald-500">■ PNL</span>
              <span className="text-blue-500">■ PING</span>
            </div>
          </h2>
          <div className="h-[140px] w-full">
            <TelemetryChart />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs text-gray-500 mb-4 tracking-widest border-b border-gray-900 pb-2">ACTIVE LEDGER</h2>
        {data?.positions && data.positions.length > 0 ? (
          <div className="bg-[#0a0a0a] border border-gray-900 rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111] text-gray-500 text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-normal">ASSET</th>
                  <th className="p-4 font-normal">ENTRY / SL</th>
                  <th className="p-4 font-normal">CURRENT</th>
                  <th className="p-4 font-normal text-right">YIELD</th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((pos, idx) => (
                  <tr key={idx} className="border-t border-gray-900 hover:bg-[#111] transition-colors">
                    <td className="p-4 text-gray-400">
                      <div className="text-white font-medium">{pos.symbol || 'UNKNOWN'}</div>
                      <div className="text-[10px] tracking-tight">{pos.mint.substring(0, 16)}...</div>
                    </td>
                    <td className="p-4">
                      <div>{pos.entry.toFixed(7)}</div>
                      <div className="text-[10px] text-red-500">SL: {pos.sl_level.toFixed(2)}%</div>
                    </td>
                    <td className="p-4 text-white">{pos.current.toFixed(7)}</td>
                    <td className={`p-4 text-right ${pos.yield_pct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {pos.yield_pct > 0 ? '+' : ''}{pos.yield_pct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center border border-gray-900 border-dashed text-gray-600 text-xs tracking-widest">
            NO ACTIVE POSITIONS
          </div>
        )}
      </div>

      <div className="border-t border-gray-900 pt-6">
        <h2 className="text-xs text-gray-500 mb-4 tracking-widest">TACTICAL COMMAND CENTER</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePanic}
            className="bg-red-950/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-6 py-3 rounded-sm text-xs tracking-widest transition-all duration-200 flex items-center gap-2 group"
          >
            <AlertOctagon size={16} className="group-hover:scale-110 transition-transform" />
            PANIC ALL
          </button>

          <button
            onClick={handleHibernate}
            className="bg-yellow-950/20 hover:bg-yellow-900/40 text-yellow-500 border border-yellow-900/50 px-6 py-3 rounded-sm text-xs tracking-widest transition-all duration-200 flex items-center gap-2 group"
          >
            <PowerOff size={16} className="group-hover:scale-110 transition-transform" />
            HIBERNATE
          </button>
        </div>
      </div>

    </main>
  );
}
