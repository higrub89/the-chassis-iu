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
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="time"
                        stroke="#333"
                        fontSize={10}
                        tickMargin={10}
                        minTickGap={20}
                    />
                    <YAxis
                        yAxisId="left"
                        domain={[(dataMin: number) => Math.min(dataMin * 1.1, -0.01), (dataMax: number) => Math.max(dataMax * 1.1, 0.01)]}
                        stroke="#10b981"
                        fontSize={10}
                        tickFormatter={(val) => val.toFixed(4)}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={['dataMin - 10', 'dataMax + 10']}
                        stroke="#3b82f6"
                        fontSize={10}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', fontSize: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                        labelStyle={{ color: '#888', marginBottom: '4px' }}
                    />
                    <ReferenceLine y={0} yAxisId="left" stroke="#333" strokeDasharray="3 3" />
                    <Line
                        yAxisId="left"
                        name="Net PNL"
                        type="monotone"
                        dataKey="pnl"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                    <Line
                        yAxisId="right"
                        name="Latency (ms)"
                        type="monotone"
                        dataKey="ping"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        isAnimationActive={false}
                        opacity={0.5}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
