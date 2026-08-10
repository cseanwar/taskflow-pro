import Link from 'next/link';
import { Kanban } from 'lucide-react';

export default function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#3525cd] text-white shadow-[0_10px_24px_-8px_rgba(53,37,205,0.55)] transition-transform duration-300 group-hover:-translate-y-0.5">
        <Kanban className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-[17px] font-extrabold tracking-tight text-[#3525cd]">
        TaskFlow <span className="font-black">Pro</span>
      </span>
    </Link>
  );
}
