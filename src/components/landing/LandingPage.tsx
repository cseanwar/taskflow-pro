'use client';

import type { IUser } from '@/types';
import Navbar from './Navbar';
import Hero from './Hero';
import LogoMarquee from './LogoMarquee';
import Features from './Features';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

export default function LandingPage({ user }: { user: IUser | null }) {
  return (
    <div className="lp-shell relative min-h-screen overflow-x-hidden">
      <Navbar user={user} />

      <main>
        <Hero user={Boolean(user)} />
        <LogoMarquee />
        <Features />
        <FinalCTA user={Boolean(user)} />
      </main>

      <Footer />

      <div className="lp-grain" aria-hidden="true" />
    </div>
  );
}
