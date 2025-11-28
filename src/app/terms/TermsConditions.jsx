"use client";

import React from "react";
import { useGetTermsConditionsQuery } from "../../../store/termsConditionsApi";

const TermsConditions = () => {
  const {
    data: termsData = [],
    isLoading,
    isError,
  } = useGetTermsConditionsQuery();

  // ✅ Handle loading state
  if (isLoading) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">Loading Terms and conditions...</p>
      </section>
    );
  }

  // ✅ Handle error state
  if (isError) {
    return (
      <section className="py-10 text-center">
        <p className="text-red-500">Failed to load Terms and conditions.</p>
      </section>
    );
  }

  // ✅ Handle empty data
  if (!termsData || termsData.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">No Terms and conditions.</p>
      </section>
    );
  }
  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto">
          {/* title */}
          <div className="flex py-2  md:flex-row items-start md:items-center justify-between mb-0 gap-2 px-2">
            <h2 className="text-xl md:py-4 md:text-3xl font-bold gradient-text">
              Terms & conditions
            </h2>
          </div>
          {/* content */}
          <div className="space-y-6 px-2">
            {termsData.map((item) => (
              <div
                key={item._id}
                className="text-white dark:text-gray-300 text-justify lg:py-5"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsConditions;
