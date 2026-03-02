import HeroBanner from "@/app/pages/Hero/HeroBanner";
import FilmMartList from "./FilmMartList";
import { BANNER_TYPES } from "../../../store/homebannerApi";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Film Mart - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FilMartPage = () => {
  return (
    <>
      <HeroBanner bannerType={BANNER_TYPES.FILM_MART} />
      <FilmMartList />
    </>
  );
};

export default FilMartPage;
