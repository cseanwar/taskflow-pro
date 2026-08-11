'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { googleSignInAction } from '@/actions/auth.actions';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            ux_mode?: 'popup' | 'redirect';
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
              locale?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleSignInButtonProps {
  onError?: (message: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
}

export default function GoogleSignInButton({ onError, text = 'signup_with' }: GoogleSignInButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) return;

    const handleCredential = async (response: { credential: string }) => {
      setLoading(true);
      try {
        const result = await googleSignInAction(response.credential);
        if (result.success) {
          router.push('/onboarding');
        } else {
          setLoading(false);
          onError?.(result.message || 'Google sign-in failed.');
        }
      } catch {
        setLoading(false);
        onError?.('Something went wrong. Please try again.');
      }
    };

    const render = () => {
      if (!containerRef.current) return;
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
      });
      window.google?.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        text,
        shape: 'rectangular',
        width: 384,
      });
    };

    if (window.google?.accounts?.id) {
      render();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [router, onError, text]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="relative flex w-full justify-center">
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-xl ${loading ? 'pointer-events-none opacity-60' : ''}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
        </div>
      )}
    </div>
  );
}
