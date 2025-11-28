import HeroBanner from "@/app/pages/Hero/HeroBanner";
import EventsList from "./EventsList";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Events - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FilMartPage = () => {
  return (
    <>
      <HeroBanner />
      <EventsList />
    </>
  );
};

export default FilMartPage;
