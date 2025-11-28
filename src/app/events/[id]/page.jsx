import EventDetails from "./EventDetails";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Event Details - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const EventDeatilsPage = () => {
  return (
    <>
      <EventDetails />
    </>
  );
};

export default EventDeatilsPage;
