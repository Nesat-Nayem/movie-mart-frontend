'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Smart Redirect Page for Events Deep Linking
 */
function EventsRedirectContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
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

    if (!eventId) {
      window.location.href = '/events';
      return;
    }

    const appScheme = `moviemart://event?id=${eventId}`;
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
          window.location.href = `/events?id=${eventId}`;
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
  }, [eventId]);

  const getStoreLink = () => {
    if (platform === 'android') {
      return 'https://play.google.com/store/apps/details?id=com.moviemart.moviemart';
    } else if (platform === 'ios') {
      return 'https://apps.apple.com/app/moviemart/id123456789';
    }
    return `/events?id=${eventId}`;
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
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieMart</h1>
          <p className="text-white/60 text-sm">Opening event details...</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
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
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              Open Manually
            </button>

            {platform === 'web' && (
              <button
                onClick={() => window.location.href = `/events?id=${eventId}`}
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

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#0a0f1e] to-[#1a1f35] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieMart</h1>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function EventsRedirect() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EventsRedirectContent />
    </Suspense>
  );
}
