"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useGetFaqsQuery } from "../../../store/faqApi";

// Skeleton FAQ item
const FaqSkeleton = () => (
  <div className="border border-gray-500 rounded-lg shadow-sm animate-pulse">
    <div className="flex justify-between items-center w-full text-left px-4 py-3">
      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      <div className="h-4 bg-gray-400 rounded w-4"></div>
    </div>
    <div className="px-4 pb-4 mt-2 space-y-2">
      <div className="h-3 bg-gray-400 rounded w-full"></div>
      <div className="h-3 bg-gray-400 rounded w-5/6"></div>
    </div>
  </div>
);

const Faq = ({ itemPage }) => {
  const { data: faqData = [], isLoading, isError } = useGetFaqsQuery();
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  if (isError) return <div>Error loading FAQs</div>;

  // Determine what to render: skeletons or actual data
  const renderFaqs = isLoading
    ? Array.from({ length: itemPage }).map((_, idx) => (
        <FaqSkeleton key={idx} />
      ))
    : faqData.slice(0, itemPage).map((faq) => (
        <div
          key={faq._id}
          className="border border-gray-500 rounded-lg shadow-sm"
        >
          <button
            className="flex justify-between items-center w-full text-left px-4 py-3 font-medium transition"
            onClick={() => toggleFaq(faq._id)}
          >
            <span>{faq.question}</span>
            <FaChevronDown
              className={`transition-transform duration-300 ${
                openId === faq._id ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`px-4 pb-4 text-sm transition-max-height duration-300 overflow-hidden ${
              openId === faq._id ? "max-h-96" : "max-h-0"
            }`}
          >
            {faq.answer}
          </div>
        </div>
      ));

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto w-full px-4">
        {/* Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">{renderFaqs}</div>
      </div>
    </section>
  );
};

export default Faq;
