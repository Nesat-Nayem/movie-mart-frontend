"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  purpose: yup.string().required("Purpose is required"),
  message: yup.string().required("Message is required"),
});

const EnquiryNow = () => {
  const router = useRouter();

  const [toastMessage, setToastMessage] = useState(null);
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const showMessage = (msg, type = "success") => {
    setToastMessage(msg);
    setToastVariant(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const onSubmit = async (values) => {
    try {
      await createEnquiry(values).unwrap();
      showMessage("Enquiry submitted successfully!", "success");

      reset();

      // ⏳ Wait 2 seconds then redirect
      setTimeout(() => {
        router.push("/film-mart");
      }, 2000);
    } catch (err) {
      showMessage(err?.data?.message || "Failed to submit enquiry", "error");
    }
  };

  return (
    <section className="py-10 relative">
      <div className="max-w-sm mx-auto shadow-2xl border border-gray-700 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="p-2 rounded-full bg-white/10 cursor-pointer"
            onClick={() => router.back()}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-lg font-semibold">Enquiry Now</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium text-sm mb-2">Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-400 rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-sm mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-400 rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-sm mb-2">Phone</label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-400 rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.phone?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-sm mb-2">Purpose</label>
            <input
              {...register("purpose")}
              type="text"
              placeholder="Enter purpose"
              className="w-full p-2 border border-gray-400 rounded-md"
            />
            <p className="text-red-500 text-sm">{errors.purpose?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-sm mb-2">Message</label>
            <textarea
              {...register("message")}
              rows="5"
              className="w-full p-2 border border-gray-400 rounded-md"
              placeholder="Enter your message"
            ></textarea>
            <p className="text-red-500 text-sm">{errors.message?.message}</p>
          </div>

          {/* Button */}
          <Button className="w-full mt-6" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>

      {/* 🚀 Toast Message */}
      {showToast && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 
          px-4 py-2 text-white rounded-md shadow-xl transition-all duration-300 
          ${toastVariant === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toastMessage}
        </div>
      )}
    </section>
  );
};

export default EnquiryNow;
