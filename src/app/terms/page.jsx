import TermsConditions from "./TermsConditions";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Terms - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const TermsPage = () => {
  return (
    <>
      <TermsConditions />
    </>
  );
};

export default TermsPage;
