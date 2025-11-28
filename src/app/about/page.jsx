import About from "./About";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "About Us- Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const AboutUsPage = () => {
  return (
    <>
      <About />
    </>
  );
};

export default AboutUsPage;
