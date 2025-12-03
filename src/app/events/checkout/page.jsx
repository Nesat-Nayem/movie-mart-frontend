import { Suspense } from "react";
import Checkout from "./Checkout";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Checkout - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading checkout...</p>
      </div>
    </div>
  );
}

const CheckoutPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Checkout />
    </Suspense>
  );
};

export default CheckoutPage;
