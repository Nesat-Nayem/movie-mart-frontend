import FilmMartDetails from "./FilmMartDetails";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Film Mart - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FilMartDetailsPage = () => {
  return (
    <>
      <FilmMartDetails />
    </>
  );
};

export default FilMartDetailsPage;
