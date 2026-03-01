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
                        domain={['auto', 'auto']}
                        stroke="#333"
                        fontSize={10}
                        tickFormatter={(val) => val.toFixed(4)}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', fontSize: '12px' }}
                        itemStyle={{ color: '#10b981' }}
                        labelStyle={{ color: '#888', marginBottom: '4px' }}
                    />
                    <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
                    <Line
                        type="monotone"
                        dataKey="pnl"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
