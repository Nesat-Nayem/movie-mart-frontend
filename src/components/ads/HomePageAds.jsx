"use client";

import { ResponsiveAd, BannerAd, InFeedAd, MultiplexAd } from "./GoogleAdsense";
import AdWrapper from "./AdWrapper";

/**
 * Home Page Ad Placements
 * Strategic ad placements that don't disrupt user experience
 */

// Top Banner Ad - Below navbar, above hero
export const TopBannerAd = () => (
  <AdWrapper 
    className="bg-[#0B1730]/50 py-2"
    minHeight="90px"
    showLabel={false}
  >
    <div className="max-w-7xl mx-auto px-4">
      <BannerAd slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER || ""} />
    </div>
  </AdWrapper>
);

// Mid-Content Ad - Between sections
export const MidContentAd = () => (
  <AdWrapper 
    className="py-4 px-4 md:px-8"
    minHeight="100px"
  >
    <div className="max-w-5xl mx-auto">
      <ResponsiveAd slot={process.env.NEXT_PUBLIC_AD_SLOT_MID_CONTENT || ""} />
    </div>
  </AdWrapper>
);

// In-Feed Ad Card - Blends with movie/event cards
export const FeedAd = ({ className = "" }) => (
  <div className={`rounded-xl overflow-hidden bg-white/5 border border-white/10 ${className}`}>
    <AdWrapper 
      minHeight="200px"
      showLabel={true}
      label="Sponsored"
    >
      <InFeedAd slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_FEED || ""} />
    </AdWrapper>
  </div>
);

// Bottom Multiplex Ad - Related content style ads
export const BottomMultiplexAd = () => (
  <AdWrapper 
    className="py-6 px-4 md:px-8 bg-[#0B1730]/30"
    minHeight="250px"
  >
    <div className="max-w-6xl mx-auto">
      <MultiplexAd slot={process.env.NEXT_PUBLIC_AD_SLOT_MULTIPLEX || ""} />
    </div>
  </AdWrapper>
);

// Sidebar Sticky Ad
export const SidebarStickyAd = () => (
  <AdWrapper 
    className="sticky top-24"
    minHeight="600px"
  >
    <ResponsiveAd slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || ""} />
  </AdWrapper>
);

// Footer Banner Ad - Above footer
export const FooterBannerAd = () => (
  <AdWrapper 
    className="bg-[#0B1730]/50 py-3"
    minHeight="90px"
    showLabel={false}
  >
    <div className="max-w-7xl mx-auto px-4">
      <BannerAd slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || ""} />
    </div>
  </AdWrapper>
);

export default {
  TopBannerAd,
  MidContentAd,
  FeedAd,
  BottomMultiplexAd,
  SidebarStickyAd,
  FooterBannerAd
};
