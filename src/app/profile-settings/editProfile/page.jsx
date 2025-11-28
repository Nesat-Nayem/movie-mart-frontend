import { Suspense } from "react";
import ProfileEditPage from "./ProfileEditPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <ProfileEditPage />
    </Suspense>
  );
}
