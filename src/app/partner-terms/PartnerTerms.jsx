"use client";

import React from "react";
import { useGetPartnerTermsQuery } from "../../../store/partnerTermsApi";

const PartnerTerms = () => {
  const {
    data: partnerTermsData = [],
    isLoading,
    isError,
  } = useGetPartnerTermsQuery();

  if (isLoading) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">Loading Partner Terms and Conditions...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-10 text-center">
        <p className="text-red-500">Failed to load Partner Terms and Conditions.</p>
      </section>
    );
  }

  if (!partnerTermsData || partnerTermsData.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">No Partner Terms and Conditions.</p>
      </section>
    );
  }
  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto">
          <div className="flex py-2  md:flex-row items-start md:items-center justify-between mb-0 gap-2 px-2">
            <h2 className="text-xl md:py-4 md:text-3xl font-bold gradient-text">
              Partner Terms and Conditions
            </h2>
          </div>
          <div className="space-y-6 px-2">
            {partnerTermsData.map((item) => (
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

export default PartnerTerms;
