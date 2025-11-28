import Login from "./Login";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Login - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
