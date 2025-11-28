import Checkout from "./Checkout";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Checkout - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const CheckoutPage = () => {
  return (
    <>
      <Checkout />
    </>
  );
};

export default CheckoutPage;
