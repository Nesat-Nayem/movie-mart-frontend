"use client";

import React from "react";
import { useGetHelpCenterQuery } from "../../../store/helpCenterApi";

const HelpSupport = () => {
  const { data: helpData = [], isLoading, isError } = useGetHelpCenterQuery();

  console.log(helpData);

  if (isLoading) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">Loading help content...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-10 text-center">
        <p className="text-red-500">Failed to load help center content.</p>
      </section>
    );
  }

  if (!helpData || helpData.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-gray-500">No help content available.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto py-2 lg:py-5">
        {/* title */}
        <div className="flex md:flex-row items-start md:items-center justify-between mb-4 gap-2 px-2">
          <h2 className="text-xl md:text-3xl font-bold gradient-text">
            Help & Support
          </h2>
        </div>

        {/* help support list */}
        <div className="space-y-6 px-2">
          {helpData.map((item) => (
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

export default HelpSupport;
