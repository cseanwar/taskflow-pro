import type { CSSProperties } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE, delay: 0.09 * i },
  }),
};

export const tilt1 = { '--lp-tilt': '1.5deg' } as CSSProperties;
export const tilt2 = { '--lp-tilt': '-1.2deg' } as CSSProperties;
