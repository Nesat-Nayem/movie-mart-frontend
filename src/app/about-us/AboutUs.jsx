"use client";

import React from "react";
import { useGetAboutUsQuery } from "../../../store/aboutUsApi";

const AboutUs = () => {
  const {
    data: aboutUsData = [],
    isLoading,
    isError,
  } = useGetAboutUsQuery();

  if (isLoading) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">Loading About Us...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-10 text-center">
        <p className="text-red-500">Failed to load About Us.</p>
      </section>
    );
  }

  if (!aboutUsData || aboutUsData.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">No About Us information.</p>
      </section>
    );
  }
  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto">
          <div className="flex py-2  md:flex-row items-start md:items-center justify-between mb-0 gap-2 px-2">
            <h2 className="text-xl md:py-4 md:text-3xl font-bold gradient-text">
              About Us
            </h2>
          </div>
          <div className="space-y-6 px-2">
            {aboutUsData.map((item) => (
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

export default AboutUs;
