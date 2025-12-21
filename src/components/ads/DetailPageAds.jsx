"use client";

import { ResponsiveAd, InArticleAd, RectangleAd } from "./GoogleAdsense";
import AdWrapper from "./AdWrapper";

/**
 * Detail Page Ad Placements
 * For movie details, event details, etc.
 */

// In-Article Ad - Between content sections
export const ArticleAd = ({ className = "" }) => (
  <AdWrapper 
    className={`py-4 ${className}`}
    minHeight="150px"
  >
    <InArticleAd slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE || ""} />
  </AdWrapper>
);

// Content Sidebar Ad - For detail pages with sidebar
export const ContentSidebarAd = ({ className = "" }) => (
  <AdWrapper 
    className={`${className}`}
    minHeight="250px"
  >
    <RectangleAd slot={process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE || ""} />
  </AdWrapper>
);

// Below Player Ad - After video player
export const BelowPlayerAd = ({ className = "" }) => (
  <AdWrapper 
    className={`py-4 ${className}`}
    minHeight="100px"
  >
    <ResponsiveAd slot={process.env.NEXT_PUBLIC_AD_SLOT_BELOW_PLAYER || ""} />
  </AdWrapper>
);

// Related Content Ad - Between related items
export const RelatedContentAd = ({ className = "" }) => (
  <AdWrapper 
    className={`py-3 ${className}`}
    minHeight="100px"
    showLabel={true}
    label="Sponsored"
  >
    <ResponsiveAd slot={process.env.NEXT_PUBLIC_AD_SLOT_RELATED || ""} />
  </AdWrapper>
);

export default {
  ArticleAd,
  ContentSidebarAd,
  BelowPlayerAd,
  RelatedContentAd
};
