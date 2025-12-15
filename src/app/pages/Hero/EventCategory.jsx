import React from "react";
import EventsCatCards from "@/app/pages/Hero/EventsCatCards";

const EventCategory = () => {
  return (
    <section className="py-4">
      <div className="w-full px-4 md:px-8 ">
        {/* title */}
        <div className="flex md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl md:text-3xl font-bold gradient-text">
            The Best Of Live Events
          </h2>
        </div>

        {/* Events Category */}
        <EventsCatCards />
      </div>
    </section>
  );
};

export default EventCategory;
