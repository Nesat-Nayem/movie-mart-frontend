"use client";

import React from "react";
import { useGetVendorPolicyQuery } from "../../../store/vendorPolicyApi";

const VendorPolicy = () => {
  const {
    data: vendorPolicyData = [],
    isLoading,
    isError,
  } = useGetVendorPolicyQuery();

  // ✅ Handle loading state
  if (isLoading) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">Loading vendorPolicyData...</p>
      </section>
    );
  }

  // ✅ Handle error state
  if (isError) {
    return (
      <section className="text-center">
        <p className="py-2 text-red-500 md:py-4">Failed to load vendorPolicyData.</p>
      </section>
    );
  }

  // ✅ Handle empty data
  if (!vendorPolicyData || vendorPolicyData.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">No vendorPolicyData.</p>
      </section>
    );
  }
  return (
    <>
      <section className="py-10">
        <div className="max-w-6xl mx-auto">
          {/* title */}
          <div className="flex  md:flex-row items-start md:items-center justify-between mb-4 gap-2 px-2">
            <h2 className="text-xl md:text-3xl font-bold gradient-text">
              Vendor Policy
            </h2>
          </div>

          {/* content */}
          <div className="space-y-6 px-2">
            {vendorPolicyData.map((item) => (
              <p
                key={item._id}
                className="text-white text-justify leading-relaxed"
              >
                {item.content.replace(/<[^>]+>/g, "")} {/* removes HTML tags */}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VendorPolicy;
