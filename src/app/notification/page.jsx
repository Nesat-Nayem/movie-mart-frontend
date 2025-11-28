import Notification from "./Notification";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Notification - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const NotificationPage = () => {
  return (
    <>
      <Notification />
    </>
  );
};

export default NotificationPage;
