import React from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

/** Display header used at the top of app pages — mono eyebrow, display title, hairline. */
export default function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="rise mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-semibold tracking-[0.3em] text-indigo-400 uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-1.5 text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-400">{description}</p>
          )}
          <div className="hairline mt-4 h-px w-full max-w-[36rem]" />
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}