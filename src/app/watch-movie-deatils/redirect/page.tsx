'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Smart Redirect Page for Deep Linking
 * 
 * This page handles incoming deep links and redirects users appropriately:
 * - If app is installed: Opens in app (handled by OS via App Links/Universal Links)
 * - If app not installed: Redirects to Play Store (Android) or App Store (iOS)
 * - Fallback: Shows video on web
 */
function DeepLinkRedirectContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web'>('web');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Detect platform
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

    if (!videoId) {
      // No video ID, redirect to home
      window.location.href = '/';
      return;
    }

    // Try to open app first (this will work if app is installed)
    const appScheme = `moviemart://watch?id=${videoId}`;
    
    // Attempt to open app
    const now = Date.now();
    window.location.href = appScheme;

    // If app doesn't open within 2 seconds, redirect to store
    const timer = setTimeout(() => {
      const elapsed = Date.now() - now;
      
      // If page is still visible after 2s, app probably isn't installed
      if (elapsed < 2500 && document.hasFocus()) {
        if (isAndroid) {
          // Redirect to Play Store
          window.location.href = 'https://play.google.com/store/apps/details?id=com.moviemart.moviemart';
        } else if (isIOS) {
          // Redirect to App Store
          window.location.href = 'https://apps.apple.com/app/moviemart/id123456789'; // Replace with actual App Store ID
        } else {
          // Fallback to web version
          window.location.href = `/watch-movie-deatils?id=${videoId}`;
        }
      }
    }, 2000);

    // Countdown timer for UI
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
  }, [videoId]);

  const getStoreLink = () => {
    if (platform === 'android') {
      return 'https://play.google.com/store/apps/details?id=com.moviemart.moviemart';
    } else if (platform === 'ios') {
      return 'https://apps.apple.com/app/moviemart/id123456789'; // Replace with actual App Store ID
    }
    return `/watch-movie-deatils?id=${videoId}`;
  };

  const getStoreName = () => {
    if (platform === 'android') return 'Google Play Store';
    if (platform === 'ios') return 'App Store';
    return 'Web Version';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#0a0f1e] to-[#1a1f35] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/50">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieMart</h1>
          <p className="text-white/60 text-sm">Opening your video...</p>
        </div>

        {/* Loading Animation */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            {/* Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{countdown}</span>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
              <p className="text-white font-medium">
                {countdown > 0 ? 'Attempting to open app...' : 'Redirecting...'}
              </p>
              <p className="text-white/50 text-sm">
                If the app doesn&apos;t open, you&apos;ll be redirected to {getStoreName()}
              </p>
            </div>

            {/* Manual Redirect Button */}
            <button
              onClick={() => window.location.href = getStoreLink()}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              Open Manually
            </button>

            {/* Web Fallback */}
            {platform === 'web' && (
              <button
                onClick={() => window.location.href = `/watch-movie-deatils?id=${videoId}`}
                className="w-full px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Watch on Web
              </button>
            )}
          </div>
        </div>

        {/* Info Text */}
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
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/50">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MovieMart</h1>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function DeepLinkRedirect() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DeepLinkRedirectContent />
    </Suspense>
  );
}
