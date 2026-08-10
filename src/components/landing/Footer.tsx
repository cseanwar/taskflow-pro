import Brand from './Brand';

const LINKS = ['Privacy', 'Terms', 'Support'];

export default function Footer() {
  return (
    <footer className="border-t border-[#e9e6f4] bg-[#f7f9fb]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <Brand />
          <p className="text-[12px] text-[#8b87a1]">© 2026 TaskFlow Pro. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-7">
          {LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-[13px] font-semibold text-[#464555] transition-colors hover:text-[#3525cd]"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
