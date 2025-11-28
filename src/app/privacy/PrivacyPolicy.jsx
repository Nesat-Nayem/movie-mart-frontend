"use client";

import React from "react";
import { useGetprivacyPolicyQuery } from "../../../store/privacyPolicyApi";

const PrivacyPolicy = () => {
  const {
    data: privacyData = [],
    isLoading,
    isError,
  } = useGetprivacyPolicyQuery();

  // ✅ Handle loading state
  if (isLoading) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">Loading privacy policy...</p>
      </section>
    );
  }

  // ✅ Handle error state
  if (isError) {
    return (
      <section className="py-10 text-center">
        <p className="text-red-500">Failed to load privacy policy.</p>
      </section>
    );
  }

  // ✅ Handle empty data
  if (!privacyData || privacyData.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">No privacy policy found.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto">
        {/* title */}
        <div className="flex md:flex-row items-start md:items-center justify-between gap-2 px-2">
          <h2 className="text-xl md:text-3xl font-bold gradient-text py-2 lg:py-5">
            Privacy Policy
          </h2>
        </div>

        {/* content */}

        <div className="space-y-6 px-2">
          {privacyData.map((item) => (
            <div
              key={item._id}
              className="text-white dark:text-gray-300 text-justify lg:py-5"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
