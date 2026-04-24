import EventCategory from "@/app/pages/Hero/EventCategory";
import Advertise from "@/app/components/Advertise";
import Faq from "@/app/components/Faq";
import HomeSections from "@/app/pages/Hero/HomeSections";
import { TopBannerAd, MidContentAd, FooterBannerAd } from "@/components/ads/HomePageAds";

export default function Home() {
  return (
    <>
      {/* Google AdSense - Top Banner */}
      <TopBannerAd />
      
      {/* All 12 Home Page Sections (with per-service hero banners inside) */}
      <HomeSections />
      
      {/* Google AdSense - Mid Content */}
      <MidContentAd />
      
      <EventCategory />
      <Advertise />
      <Faq />
      
      {/* Google AdSense - Footer Banner */}
      <FooterBannerAd />
    </>
  );
}
