import HeroBanner from "@/app/pages/Hero/HeroBanner";
import MovieList from "./MovieList";

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
      <MovieList />
    </>
  );
};

export default FilMartPage;
