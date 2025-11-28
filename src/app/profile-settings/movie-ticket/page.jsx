import MovieTicket from "./MovieTicket";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Movie Ticket - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const MovieTicketPage = () => {
  return (
    <>
      <MovieTicket />
    </>
  );
};

export default MovieTicketPage;
