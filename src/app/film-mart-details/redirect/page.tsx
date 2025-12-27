'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Smart Redirect Page for Film Trade Deep Linking
 */
export default function FilmTradeRedirect() {
  const searchParams = useSearchParams();
  const filmId = searchParams.get('id');
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web'>('web');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    if (isAndroid) {
      setPlatform('android');
    } else if (isIOS) {
      setPlatform('ios');
    } else {
      setPlatform('web');
    }

    if (!filmId) {
      window.location.href = '/film-mart';
      return;
    }

    const appScheme = `moviemart://film-trade?id=${filmId}`;
    const now = Date.now();
    window.location.href = appScheme;

    const timer = setTimeout(() => {
      const elapsed = Date.now() - now;
      if (elapsed < 2500 && document.hasFocus()) {
        if (isAndroid) {
          window.location.href = 'https://play.google.com/store/apps/details?id=com.moviemart.moviemart';
        } else if (isIOS) {
          window.location.href = 'https://apps.apple.com/app/moviemart/id123456789';
        } else {
          window.location.href = `/film-mart-details?id=${filmId}`;
        }
      }
    }, 2000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [filmId]);

  const getStoreLink = () => {
    if (platform === 'android') {
      return 'https://play.google.com/store/apps/details?id=com.moviemart.moviemart';
    } else if (platform === 'ios') {
      return 'https://apps.apple.com/app/moviemart/id123456789';
    }
    return `/film-mart-details?id=${filmId}`;
  };

  const getStoreName = () => {
    if (platform === 'android') return 'Google Play Store';
    if (platform === 'ios') return 'App Store';
    return 'Web Version';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#0a0f1e] to-[#1a1f35] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieMart</h1>
          <p className="text-white/60 text-sm">Opening film details...</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{countdown}</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-white font-medium">
                {countdown > 0 ? 'Attempting to open app...' : 'Redirecting...'}
              </p>
              <p className="text-white/50 text-sm">
                If the app doesn&apos;t open, you&apos;ll be redirected to {getStoreName()}
              </p>
            </div>

            <button
              onClick={() => window.location.href = getStoreLink()}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Open Manually
            </button>

            {platform === 'web' && (
              <button
                onClick={() => window.location.href = `/film-mart-details?id=${filmId}`}
                className="w-full px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                View on Web
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Get the best experience with our mobile app
        </p>
      </div>
    </div>
  );
}
