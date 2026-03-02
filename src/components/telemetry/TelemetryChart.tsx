'use client';

import { useTelemetryStore } from '../../store/useTelemetryStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function TelemetryChart() {
    const { history } = useTelemetryStore();

    if (!history || history.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs tracking-widest">
                WAITING FOR TELEMETRY...
            </div>
        );
    }

    return (
        <div className="w-full h-full relative group">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="time"
                        stroke="#ffffff10"
                        tick={{ fill: '#ffffff50', fontSize: 9, fontFamily: 'monospace' }}
                        tickMargin={10}
                        minTickGap={20}
                        axisLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        domain={['auto', 'auto']}
                        stroke="#06b6d430"
                        tick={{ fill: '#06b6d4', fontSize: 9, fontFamily: 'monospace' }}
                        tickFormatter={(val) => val.toFixed(4)}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={['dataMin - 10', 'dataMax + 10']}
                        stroke="#3b82f630"
                        tick={{ fill: '#3b82f680', fontSize: 9, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(3, 3, 3, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
                        }}
                        itemStyle={{ color: '#06b6d4', fontWeight: 900, letterSpacing: '2px' }}
                        labelStyle={{ color: '#888', marginBottom: '8px', letterSpacing: '1px' }}
                    />
                    <ReferenceLine y={0} yAxisId="left" stroke="#ffffff15" strokeDasharray="3 3" />
                    <Line
                        yAxisId="left"
                        name="Net Returns"
                        type="monotone"
                        dataKey="pnl"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                        style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' }}
                    />
                    <Line
                        yAxisId="right"
                        name="SYS/LAT"
                        type="monotone"
                        dataKey="ping"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        isAnimationActive={false}
                        opacity={0.3}
                        style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
