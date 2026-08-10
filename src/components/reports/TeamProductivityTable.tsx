'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, Bug, Sparkles } from 'lucide-react';
import { ITeamProductivityMember, ITeamWorkloadMember } from '@/types';

interface Props {
  members: ITeamProductivityMember[];
  workload: ITeamWorkloadMember[];
}

const COLUMN_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  testing: 'Testing',
  done: 'Done',
};

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  return avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatar} alt={name} className="h-8 w-8 rounded-full bg-slate-800 object-cover" />
  ) : (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600/20 text-[11px] font-bold text-indigo-300">
      {name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase()}
    </span>
  );
}

function MemberDetail({ member, workload }: { member: ITeamProductivityMember; workload?: ITeamWorkloadMember }) {
  const feats = member.completedFeatures + member.openFeatures;
  const bugs = member.completedBugs + member.openBugs;
  const featShare = Math.round((feats / (feats + bugs || 1)) * 100);
  const bugShare = Math.round((bugs / (feats + bugs || 1)) * 100);
  const byColumn = Object.entries(workload?.byColumn || {});

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Features vs Bugs</h5>
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="h-3 w-3 text-emerald-400" /> Features
                </span>
                <span className="text-slate-400">{featShare}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${featShare}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Bug className="h-3 w-3 text-rose-400" /> Bugs
                </span>
                <span className="text-slate-400">{bugShare}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-rose-400" style={{ width: `${bugShare}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Work</h5>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-900/70 p-2.5 text-center">
              <p className="text-lg font-extrabold text-emerald-400">{member.totalCompleted}</p>
              <p className="text-[10px] text-slate-500">Done</p>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-2.5 text-center">
              <p className="text-lg font-extrabold text-indigo-400">{member.completionRate}%</p>
              <p className="text-[10px] text-slate-500">Rate</p>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-2.5 text-center">
              <p className="text-lg font-extrabold text-slate-200">{member.completedFeatures}</p>
              <p className="text-[10px] text-slate-500">Feat. done</p>
            </div>
            <div className="rounded-lg bg-slate-900/70 p-2.5 text-center">
              <p className="text-lg font-extrabold text-slate-200">{member.completedBugs}</p>
              <p className="text-[10px] text-slate-500">Bugs done</p>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open by Column</h5>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {byColumn.length === 0 && <p className="text-xs text-slate-500">No open tasks</p>}
            {byColumn.map(([col, count]) => (
              <span key={col} className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-300">
                {COLUMN_LABELS[col] || col} <span className="font-bold text-slate-100">{count}</span>
              </span>
            ))}
          </div>
          {workload && (
            <p className="mt-3 text-[11px] text-slate-400">
              Workload{' '}
              <span className="font-bold text-slate-200">
                {workload.openTasks}/{workload.capacity}
              </span>{' '}
              · {workload.workloadPercent}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamProductivityTable({ members, workload }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalRatio = members.reduce((sum, m) => sum + m.totalCompleted, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-semibold">Member</th>
            <th className="px-3 py-3 font-semibold">Features</th>
            <th className="px-3 py-3 font-semibold">Bugs</th>
            <th className="px-3 py-3 font-semibold">Completed</th>
            <th className="px-4 py-3 font-semibold">Completion</th>
            <th className="px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {members.map(member => {
            const wl = workload.find(w => w.userId === member.userId);
            const share = totalRatio > 0 ? Math.round((member.totalCompleted / totalRatio) * 100) : 0;
            const isOpen = expanded === member.userId;
            return (
              <Fragment key={member.userId}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : member.userId)}
                  className="cursor-pointer border-b border-slate-800/60 transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={member.name} avatar={member.avatar} />
                      <div>
                        <p className="font-semibold text-slate-200">{member.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {member.totalCompleted + member.totalOpen} tasks · {share}% of done
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-emerald-400 font-semibold">{member.completedFeatures}</td>
                  <td className="px-3 py-3 text-rose-400 font-semibold">{member.completedBugs}</td>
                  <td className="px-3 py-3 text-slate-200 font-semibold">
                    {member.totalCompleted}
                    <span className="text-slate-500 font-normal"> / {member.totalCompleted + member.totalOpen}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">{member.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={6} className="border-b border-slate-800/60 px-4 py-3">
                      <MemberDetail member={member} workload={wl} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {members.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                No assignee data for this project yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
