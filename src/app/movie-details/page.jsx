import MovieDetails from "./MovieDetails";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Movie Details - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const MovieDeatilsPage = () => {
  return (
    <>
      <MovieDetails />
    </>
  );
};

export default MovieDeatilsPage;
