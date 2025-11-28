import ProfileSettings from "./ProfileSettings";



// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Profile - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const ProfileSettingsPage = () => {
  return (
    <>
      
      <ProfileSettings />
    </>
  );
};

export default ProfileSettingsPage;
