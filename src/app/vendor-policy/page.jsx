import VendorPolicy from "./VendorPolicy";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Vendor Policy - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const VendorPage = () => {
  return (
    <>
      <VendorPolicy />
    </>
  );
};

export default VendorPage;
