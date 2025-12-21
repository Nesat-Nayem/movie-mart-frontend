"use client";

import { useEffect, useRef } from "react";

/**
 * Google AdSense Component
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up for Google AdSense at https://www.google.com/adsense
 * 2. Get your Publisher ID (ca-pub-XXXXXXXXXX)
 * 3. Create ad units in AdSense dashboard
 * 4. Add your Publisher ID to NEXT_PUBLIC_ADSENSE_ID in .env.local
 * 5. Add ad slot IDs when creating ad units
 */

// AdSense Publisher ID - Replace with your actual ID
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-XXXXXXXXXX";

/**
 * Base AdSense Ad Component
 * @param {Object} props
 * @param {string} props.slot - Ad unit slot ID from AdSense
 * @param {string} props.format - Ad format: 'auto', 'fluid', 'rectangle', 'vertical', 'horizontal'
 * @param {boolean} props.responsive - Enable responsive sizing
 * @param {string} props.style - Additional inline styles
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - Layout type for in-feed/in-article ads
 * @param {string} props.layoutKey - Layout key for fluid ads
 */
const GoogleAd = ({ 
  slot, 
  format = "auto", 
  responsive = true, 
  style = {}, 
  className = "",
  layout = "",
  layoutKey = ""
}) => {
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Prevent duplicate ad loading
    if (isAdLoaded.current) return;
    
    try {
      // Push ad to AdSense
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // Don't render in development without proper setup
  if (ADSENSE_ID === "ca-pub-XXXXXXXXXX") {
    return (
      <div 
        className={`bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ minHeight: "90px", ...style }}
      >
        <div className="text-center p-4">
          <p className="font-medium">Ad Space</p>
          <p className="text-xs text-gray-600">Configure NEXT_PUBLIC_ADSENSE_ID</p>
        </div>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: "block",
        overflow: "hidden",
        ...style
      }}
      data-ad-client={ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layout && { "data-ad-layout": layout })}
      {...(layoutKey && { "data-ad-layout-key": layoutKey })}
    />
  );
};

/**
 * Banner Ad - Horizontal banner for header/footer areas
 * Recommended sizes: 728x90 (leaderboard), 970x90 (large leaderboard)
 */
export const BannerAd = ({ slot = "", className = "" }) => (
  <div className={`w-full flex justify-center py-2 ${className}`}>
    <GoogleAd
      slot={slot}
      format="horizontal"
      style={{ 
        width: "100%",
        maxWidth: "970px",
        minHeight: "90px"
      }}
      className="mx-auto"
    />
  </div>
);

/**
 * Rectangle Ad - Medium rectangle for sidebar/content areas
 * Recommended sizes: 300x250, 336x280
 */
export const RectangleAd = ({ slot = "", className = "" }) => (
  <div className={`flex justify-center ${className}`}>
    <GoogleAd
      slot={slot}
      format="rectangle"
      style={{ 
        width: "300px",
        height: "250px"
      }}
    />
  </div>
);

/**
 * In-Feed Ad - Native ad that blends with content feed
 * Best for: between movie cards, event listings
 */
export const InFeedAd = ({ slot = "", className = "" }) => (
  <div className={`w-full ${className}`}>
    <GoogleAd
      slot={slot}
      format="fluid"
      layout="in-feed"
      layoutKey="-fb+5w+4e-db+86"
      style={{ 
        display: "block",
        width: "100%"
      }}
    />
  </div>
);

/**
 * In-Article Ad - Native ad for within article/detail content
 * Best for: movie details, event details pages
 */
export const InArticleAd = ({ slot = "", className = "" }) => (
  <div className={`w-full my-6 ${className}`}>
    <GoogleAd
      slot={slot}
      format="fluid"
      layout="in-article"
      style={{ 
        display: "block",
        textAlign: "center"
      }}
    />
  </div>
);

/**
 * Sidebar Ad - Vertical sticky ad for sidebar
 * Recommended sizes: 160x600, 300x600
 */
export const SidebarAd = ({ slot = "", className = "" }) => (
  <div className={`sticky top-20 ${className}`}>
    <GoogleAd
      slot={slot}
      format="vertical"
      style={{ 
        width: "160px",
        minHeight: "600px"
      }}
    />
  </div>
);

/**
 * Responsive Auto Ad - Automatically adjusts to available space
 * Best for: general purpose, mobile-friendly
 */
export const ResponsiveAd = ({ slot = "", className = "" }) => (
  <div className={`w-full ${className}`}>
    <GoogleAd
      slot={slot}
      format="auto"
      responsive={true}
      style={{ 
        display: "block",
        width: "100%",
        minHeight: "100px"
      }}
    />
  </div>
);

/**
 * Multiplex Ad - Grid of related content/ads
 * Best for: end of page, recommended section
 */
export const MultiplexAd = ({ slot = "", className = "" }) => (
  <div className={`w-full py-4 ${className}`}>
    <GoogleAd
      slot={slot}
      format="autorelaxed"
      style={{ 
        display: "block",
        width: "100%",
        minHeight: "250px"
      }}
    />
  </div>
);

export default GoogleAd;
