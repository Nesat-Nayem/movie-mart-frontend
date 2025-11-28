import React from "react";
import EventsCatCards from "@/app/pages/Hero/EventsCatCards";

const EventCategory = () => {
  return (
    <>
      <section>
        <div className="max-w-6xl  mx-auto w-full">
          {/* title */}
          <div className="flex  md:flex-row items-start md:items-center justify-between mb-4 gap-2 py-2 px-2">
            <h2 className="text-xl md:text-3xl font-bold gradient-text">
              The Best Of Live Events
            </h2>
          </div>

          {/* Events Category */}
          <EventsCatCards />
        </div>
      </section>
    </>
  );
};

export default EventCategory;
