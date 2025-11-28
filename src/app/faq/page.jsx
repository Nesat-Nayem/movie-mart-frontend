import Faq from "./Faq";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Frequently Asked Questions - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const FaqPage = () => {
  return (
    <>
      <Faq />
    </>
  );
};

export default FaqPage;
