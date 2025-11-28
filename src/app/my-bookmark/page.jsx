import Bookmark from "./Bookmark";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Bookmark - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const BookmarkPage = () => {
  return (
    <>
      <Bookmark />
    </>
  );
};

export default BookmarkPage;
