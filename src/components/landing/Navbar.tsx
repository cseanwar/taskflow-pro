'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth.actions';
import type { IUser } from '@/types';
import Brand from './Brand';
import { fadeUp } from './motion';

const LINKS: [string, string][] = [
  ['Product', '#features'],
  ['Solutions', '#features'],
  ['Pricing', '#cta'],
];

const avatarUrl = (user: IUser) =>
  user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

export default function Navbar({ user }: { user: IUser | null }) {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 28));

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logoutAction();
    router.push('/');
    router.refresh();
  };

  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={0}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-[#e9e6f4] bg-white/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-18 container items-center justify-between px-6">
        <Brand />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[13px] font-semibold text-[#464555] transition-colors hover:text-[#3525cd]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg border border-[#e9e6f4] bg-white/80 p-1 pr-2.5 shadow-sm backdrop-blur transition-colors hover:border-[#3525cd]/30 cursor-pointer"
              >
                <Image
                  width={32}
                  height={32}
                  src={avatarUrl(user)}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-[#3525cd]/15"
                />
                <span className="hidden text-left sm:block">
                  <span className="block text-[12px] font-bold leading-tight text-[#191c1e]">{user.name}</span>
                  <span className="block text-[10px] font-medium leading-tight text-[#3525cd]">{user.role}</span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#8b87a1] transition-transform duration-200 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[#e9e6f4] bg-white p-2 shadow-[0_28px_60px_-20px_rgba(53,37,205,0.35)]"
                >
                  <div className="mb-1.5 flex items-center gap-3 rounded-xl bg-[#f4f2fa] p-3">
                    <Image
                      width={40}
                      height={40}
                      src={avatarUrl(user)}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#3525cd]/20"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-extrabold text-[#191c1e]">{user.name}</p>
                      <p className="truncate text-[11px] text-[#777587]">{user.email}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#464555] transition-colors hover:bg-[#f4f2fa] hover:text-[#3525cd]"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#3525cd]" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#e14b46] transition-colors hover:bg-[#ffeceb] cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[13px] font-semibold text-[#464555] transition-colors hover:text-[#3525cd] sm:block"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#3525cd] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(53,37,205,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#2d1fb8]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
