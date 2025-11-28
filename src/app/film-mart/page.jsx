import HeroBanner from "@/app/pages/Hero/HeroBanner";
import FilmMartList from "./FilmMartList";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Film Mart - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FilMartPage = () => {
  return (
    <>
      <HeroBanner />
      <FilmMartList />
    </>
  );
};

export default FilMartPage;
