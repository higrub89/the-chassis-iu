import { z } from 'zod';

export const PositionSchema = z.object({
  mint: z.string(),
  symbol: z.string(),
  entry: z.number(),
  current: z.number(),
  yield_pct: z.number(),
  sl_level: z.number(),
});

export const TelemetryTickSchema = z.object({
  t: z.number(),
  net_pnl: z.number().optional(),
  pnl: z.number().optional(),
  rpc_ping: z.number(),
  wallet_balance: z.number().optional(),
  sol_price: z.number().optional(),
  status: z.string(),
  positions: z.array(PositionSchema),
});

export type TelemetryTick = z.infer<typeof TelemetryTickSchema>;
export type Position = z.infer<typeof PositionSchema>;
