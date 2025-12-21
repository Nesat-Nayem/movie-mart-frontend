import HeroBanner from "@/app/pages/Hero/HeroBanner";
import MovieList from "./MovieList";
import { TopBannerAd, FooterBannerAd } from "@/components/ads/HomePageAds";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Film Mart - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FilMartPage = () => {
  return (
    <>
      {/* Google AdSense - Top Banner */}
      <TopBannerAd />
      <HeroBanner />
      <MovieList />
      {/* Google AdSense - Footer Banner */}
      <FooterBannerAd />
    </>
  );
};

export default FilMartPage;
