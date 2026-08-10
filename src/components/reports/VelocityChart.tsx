'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  type TooltipContentProps,
} from 'recharts';
import { IVelocityEntry } from '@/types';

interface Props {
  velocity: IVelocityEntry[];
}

interface VelocityRow {
  name: string;
  Committed: number;
  Completed: number;
  committedPoints: number;
  completedPoints: number;
}

const COLORS = { committed: '#818cf8', completed: '#34d399' };

function VelocityTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload as VelocityRow | undefined;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-bold text-slate-300">{label}</p>
      {payload.map(entry => {
        const isCommitted = entry.dataKey === 'Committed';
        const value = Number(entry.value ?? 0);
        const points = isCommitted ? row?.committedPoints : row?.completedPoints;
        return (
          <p key={String(entry.dataKey)} className="flex items-center gap-2 text-slate-200">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: isCommitted ? COLORS.committed : COLORS.completed }}
            />
            {entry.name}: {value} ({points ?? 0} pts)
          </p>
        );
      })}
    </div>
  );
}

export default function VelocityChart({ velocity }: Props) {
  const data = velocity
    .slice()
    .reverse()
    .map(v => ({
      name: v.name.length > 18 ? v.name.slice(0, 18) + '…' : v.name,
      Committed: v.committed,
      Completed: v.completed,
      committedPoints: v.committedPoints,
      completedPoints: v.completedPoints,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 text-center">
        <p className="text-sm font-semibold text-slate-400">No sprint data yet</p>
        <p className="mt-1 text-xs text-slate-500">Create a sprint and assign tasks to see velocity.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: '#1e293b', opacity: 0.4 }}
            content={props => (props ? <VelocityTooltip {...props} /> : null)}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Bar dataKey="Committed" fill={COLORS.committed} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Completed" fill={COLORS.completed} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}