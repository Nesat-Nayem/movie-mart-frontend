import HeroBanner from "@/app/pages/Hero/HeroBanner";
import EventCategory from "@/app/pages/Hero/EventCategory";
import Advertise from "@/app/components/Advertise";
import Faq from "@/app/components/Faq";
import HomeSections from "@/app/pages/Hero/HomeSections";

export default function Home() {
  return (
    <>
      <HeroBanner />
      
      {/* All 12 Home Page Sections */}
      <HomeSections />
      
      <EventCategory />
      <Advertise />
      <Faq />
    </>
  );
}
