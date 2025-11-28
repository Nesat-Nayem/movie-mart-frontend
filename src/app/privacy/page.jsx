import PrivacyPolicy from "./PrivacyPolicy";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Privacy - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const PrivacyPage = () => {
  return (
    <>
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPage;
