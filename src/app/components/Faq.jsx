"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useGetFaqsQuery } from "../../../store/faqApi";

const Faq = () => {
  const { data: faqData = [], isLoading, isError } = useGetFaqsQuery();
  console.log(faqData);
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="mt-3">
      <div className="max-w-6xl mx-auto w-full px-4">
        {/* Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq._id}
              className="border border-gray-500 rounded-lg shadow-sm"
            >
              {/* Title */}
              <button
                className="flex justify-between items-center w-full text-left px-4 py-3 font-medium cursor-pointer"
                onClick={() => toggleFaq(faq._id)}
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    openId === faq._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Info collapses (answer) */}
              {openId === faq._id && (
                <div className="px-4 pb-4 text-sm">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
