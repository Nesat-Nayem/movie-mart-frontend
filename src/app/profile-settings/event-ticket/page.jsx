import EventTicket from "./EventTicket";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Event Ticket - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const EventTicketPage = () => {
  return (
    <>
      <EventTicket />
    </>
  );
};

export default EventTicketPage;
