import HeroBanner from "@/app/pages/Hero/HeroBanner";
import HelpSupport from "./HelpSupport";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Help - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const HelpPage = () => {
  return (
    <>
      <HelpSupport />
    </>
  );
};

export default HelpPage;
