import EnquiryNow from "./EnquiryNow";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Enquiry Now - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const EnquiryNowPage = () => {
  return (
    <>
      <EnquiryNow />
    </>
  );
};

export default EnquiryNowPage;
