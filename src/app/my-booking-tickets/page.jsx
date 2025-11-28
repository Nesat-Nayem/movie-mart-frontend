import MyBookingTickets from "./MyBookingTickets";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "My Booking Tickets - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const MyBookingTicketsPage = () => {
  return (
    <>
      <MyBookingTickets />
    </>
  );
};

export default MyBookingTicketsPage;
