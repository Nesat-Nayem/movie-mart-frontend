import { Suspense } from "react";
import ProfileEditPage from "./ProfileEditPage";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProfileEditPage />
    </Suspense>
  );
}
