# Google AdSense Integration

## Setup Instructions

### 1. Get Your AdSense Account
1. Sign up at [Google AdSense](https://www.google.com/adsense)
2. Add your website domain for verification
3. Wait for approval (usually 1-14 days)

### 2. Get Your Publisher ID
After approval, find your Publisher ID in AdSense dashboard:
- Format: `ca-pub-XXXXXXXXXXXXXXXXXX`

### 3. Create Ad Units
In AdSense dashboard, create ad units for different placements:

| Ad Type | Recommended Size | Slot Variable |
|---------|-----------------|---------------|
| Top Banner | 970x90 | `NEXT_PUBLIC_AD_SLOT_TOP_BANNER` |
| Mid Content | Auto/Responsive | `NEXT_PUBLIC_AD_SLOT_MID_CONTENT` |
| In-Feed | Fluid | `NEXT_PUBLIC_AD_SLOT_IN_FEED` |
| Multiplex | Auto | `NEXT_PUBLIC_AD_SLOT_MULTIPLEX` |
| Sidebar | 300x600 | `NEXT_PUBLIC_AD_SLOT_SIDEBAR` |
| Footer | 728x90 | `NEXT_PUBLIC_AD_SLOT_FOOTER` |
| In-Article | Fluid | `NEXT_PUBLIC_AD_SLOT_IN_ARTICLE` |
| Rectangle | 300x250 | `NEXT_PUBLIC_AD_SLOT_RECTANGLE` |
| Below Player | Auto | `NEXT_PUBLIC_AD_SLOT_BELOW_PLAYER` |
| Related | Auto | `NEXT_PUBLIC_AD_SLOT_RELATED` |

### 4. Add Environment Variables

Create or update your `.env.local` file:

```env
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXXXX

# Ad Slot IDs (create these in AdSense dashboard)
NEXT_PUBLIC_AD_SLOT_TOP_BANNER=1234567890
NEXT_PUBLIC_AD_SLOT_MID_CONTENT=1234567891
NEXT_PUBLIC_AD_SLOT_IN_FEED=1234567892
NEXT_PUBLIC_AD_SLOT_MULTIPLEX=1234567893
NEXT_PUBLIC_AD_SLOT_SIDEBAR=1234567894
NEXT_PUBLIC_AD_SLOT_FOOTER=1234567895
NEXT_PUBLIC_AD_SLOT_IN_ARTICLE=1234567896
NEXT_PUBLIC_AD_SLOT_RECTANGLE=1234567897
NEXT_PUBLIC_AD_SLOT_BELOW_PLAYER=1234567898
NEXT_PUBLIC_AD_SLOT_RELATED=1234567899
```

### 5. Usage Examples

```jsx
// Import ad components
import { 
  TopBannerAd, 
  MidContentAd, 
  FooterBannerAd 
} from '@/components/ads/HomePageAds';

import { 
  ArticleAd, 
  BelowPlayerAd 
} from '@/components/ads/DetailPageAds';

// Use in your components
function HomePage() {
  return (
    <>
      <TopBannerAd />
      <HeroSection />
      <MidContentAd />
      <MovieSection />
      <FooterBannerAd />
    </>
  );
}
```

## Ad Placement Best Practices

1. **Don't overload** - Max 3-4 ads per page
2. **Above the fold** - Place one ad visible without scrolling
3. **Natural breaks** - Insert ads between content sections
4. **Mobile friendly** - Use responsive ad formats
5. **Don't disrupt** - Never place ads that block content

## Troubleshooting

### Ads not showing?
1. Check if AdSense is approved for your domain
2. Verify Publisher ID is correct
3. Check browser console for errors
4. Ad blockers may hide ads during testing

### Testing Ads
- Use `?google_console=1` parameter to debug
- Check AdSense dashboard for impressions
- Allow 24-48 hours for new ads to start showing

## Files Structure

```
src/components/ads/
├── GoogleAdsense.jsx    # Base ad components
├── AdWrapper.jsx        # Wrapper with error handling
├── HomePageAds.jsx      # Homepage ad placements
├── DetailPageAds.jsx    # Detail page ad placements
├── index.js             # Exports
└── README.md            # This file
```
