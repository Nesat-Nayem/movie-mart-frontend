"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useGetFaqsQuery } from "../../../store/faqApi";

// Modern Skeleton for FAQ
const FaqSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="rounded-lg overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-lg" />
      </div>
    ))}
  </div>
);

const Faq = () => {
  const { data: faqData = [], isLoading, isError } = useGetFaqsQuery();
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-6">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
            <div className="h-8 w-72 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          </div>
          <FaqSkeleton />
        </div>
      </section>
    );
  }

  // Don't render if no FAQs
  if (isError || !faqData.length) return null;

  return (
    <section className="py-6">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqData.map((faq) => (
            <div
              key={faq._id}
              className="border border-gray-600 rounded-xl overflow-hidden bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:border-gray-500"
            >
              {/* Title */}
              <button
                className="flex justify-between items-center w-full text-left px-4 py-4 font-medium cursor-pointer"
                onClick={() => toggleFaq(faq._id)}
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 text-gray-400 ${
                    openId === faq._id ? "rotate-180 text-red-400" : ""
                  }`}
                />
              </button>

              {/* Info collapses (answer) */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq._id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 pb-4 text-sm text-gray-300">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
