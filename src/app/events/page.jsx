import { Suspense } from "react";
import HeroBanner from "@/app/pages/Hero/HeroBanner";
import EventsList from "./EventsList";
import { TopBannerAd, FooterBannerAd } from "@/components/ads/HomePageAds";
import { BANNER_TYPES } from "../../../store/homebannerApi";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Events - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FilMartPage = () => {
  return (
    <>
      {/* Google AdSense - Top Banner */}
      <TopBannerAd />
      <HeroBanner bannerType={BANNER_TYPES.EVENTS} />
      <Suspense fallback={null}>
        <EventsList />
      </Suspense>
      {/* Google AdSense - Footer Banner */}
      <FooterBannerAd />
    </>
  );
};

export default FilMartPage;
