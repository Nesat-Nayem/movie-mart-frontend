import HeroBanner from "@/app/pages/Hero/HeroBanner";
import RecommandedMovies from "@/app/pages/Hero/RecommandedMovies";
import EventCategory from "@/app/pages/Hero/EventCategory";
import Advertise from "@/app/components/Advertise";
import Faq from "@/app/components/Faq";
import PopularEvents from "@/app/pages/Hero/PopularEvents";

export default function Home() {
  return (
    <>
      {/* Add 
    Watch Movies */}
      <HeroBanner />
      <RecommandedMovies />
      <EventCategory />
      <Advertise />
      <PopularEvents />
      <Faq />
    </>
  );
}
