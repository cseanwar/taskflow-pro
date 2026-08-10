'use client';

import { ITeamWorkloadMember } from '@/types';

interface Props {
  workload: ITeamWorkloadMember[];
}

const COLUMN_ORDER = ['backlog', 'todo', 'in_progress', 'review', 'testing', 'done'];
const COLUMN_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  testing: 'Testing',
  done: 'Done',
};

const ALLOCATION_STYLES: Record<string, string> = {
  over: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ok: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  under: 'bg-slate-500/15 text-slate-400 border-slate-600/40',
};

const ALLOCATION_LABELS: Record<string, string> = {
  over: 'Over-allocated',
  high: 'Near capacity',
  ok: 'Balanced',
  under: 'Under-allocated',
};

function heatColor(count: number, max: number): string {
  if (count === 0) return 'bg-slate-900/50';
  const ratio = count / (max || 1);
  if (ratio >= 0.75) return 'bg-rose-500/40 text-rose-100';
  if (ratio >= 0.5) return 'bg-amber-500/35 text-amber-100';
  if (ratio >= 0.25) return 'bg-indigo-500/35 text-indigo-100';
  return 'bg-slate-700/60 text-slate-300';
}

export default function WorkloadCapacity({ workload }: Props) {
  const maxCell = workload.reduce((max, m) => {
    const colMax = Math.max(0, ...Object.values(m.byColumn));
    return Math.max(max, colMax);
  }, 0);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-semibold">Member</th>
            {COLUMN_ORDER.map(col => (
              <th key={col} className="px-2 py-3 text-center font-semibold">
                {COLUMN_LABELS[col]}
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">Allocation</th>
          </tr>
        </thead>
        <tbody>
          {workload.map(member => (
            <tr key={member.userId} className="border-b border-slate-800/60">
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{member.name}</p>
                <p className="text-[10px] text-slate-500">
                  {member.openTasks} open · {member.totalTasks} total
                </p>
              </td>
              {COLUMN_ORDER.map(col => {
                const count = member.byColumn[col] || 0;
                return (
                  <td key={col} className="px-2 py-3">
                    <div
                      className={`grid h-9 place-items-center rounded-lg text-[11px] font-bold ${heatColor(count, maxCell)}`}
                    >
                      {count > 0 ? count : '·'}
                    </div>
                  </td>
                );
              })}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        member.allocation === 'over'
                          ? 'bg-rose-500'
                          : member.allocation === 'high'
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                      }`}
                      style={{ width: `${member.workloadPercent}%` }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-200">{member.workloadPercent}%</p>
                    <span className={`rounded border px-1 py-px text-[9px] font-semibold ${ALLOCATION_STYLES[member.allocation]}`}>
                      {ALLOCATION_LABELS[member.allocation]}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {workload.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                No assigned tasks for this project yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
