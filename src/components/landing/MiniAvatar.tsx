export default function MiniAvatar({ bg, initials }: { bg: string; initials: string }) {
  return (
    <span
      className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border border-white text-[7px] font-extrabold text-white ${bg}`}
    >
      {initials}
    </span>
  );
}
