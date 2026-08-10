import { Cpu, Globe, Hexagon, Layers } from 'lucide-react';

const LOGOS = [
  { name: 'AcemCorp', icon: Hexagon },
  { name: 'GlobalNet', icon: Globe },
  { name: 'NexusTech', icon: Cpu },
  { name: 'Structura', icon: Layers },
];

function LogoRow({ id }: { id: string }) {
  return (
    <div className="flex shrink-0 items-center">
      {LOGOS.map((logo) => (
        <span key={`${id}-${logo.name}`} className="flex items-center gap-2.5 px-10 text-[#8b87a1]">
          <logo.icon className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-[15px] font-bold tracking-tight">{logo.name}</span>
        </span>
      ))}
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <section className="border-y border-[#eae6f4] bg-white/60 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="lp-mono text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b87a1]">
          Trusted by innovative teams worldwide
        </p>
        <div className="relative mt-6 overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="lp-marquee-track">
            <LogoRow id="a" />
            <LogoRow id="b" />
          </div>
        </div>
      </div>
    </section>
  );
}
