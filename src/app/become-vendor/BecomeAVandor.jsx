"use client";  

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useGetSubscriptionQuery } from "../../../store/subscriptionApi";
import { useCreateAdvertiseMutation } from "../../../store/becomeVendorApi";

const BecomeAVendor = () => {
  const [step, setStep] = useState(1);

  // ✅ Subscription API
  const {
    data: subscriptionData = [],
    isLoading: subLoading,
    isError: subError,
  } = useGetSubscriptionQuery();

  // ✅ Vendor creation mutation
  const [createVendor, { isLoading: vendorLoading }] =
    useCreateAdvertiseMutation();

  // ✅ Form Data
  const [formData, setFormData] = useState({
    vendorName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    email: "",
    phone: "",
    aadharFrontUrl: null,
    aadharBackUrl: null,
    panImageUrl: null,
    plan: "Basic",
  });

  // ✅ Previews
  const [previews, setPreviews] = useState({
    aadharFrontUrl: null,
    aadharBackUrl: null,
    panImageUrl: null,
  });

  const steps = ["Vendor Info", "KYC Upload", "Plan Purchase", "Review"];

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Navigation
  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") form.append(key, value);
      });

      const res = await createVendor(form).unwrap();
      console.log("Vendor Created ✅:", res);
      toast.success("🎉 Vendor created successfully!");

      // Reset form
      setFormData({
        vendorName: "",
        businessType: "",
        gstNumber: "",
        panNumber: "",
        address: "",
        email: "",
        phone: "",
        aadharFrontUrl: null,
        aadharBackUrl: null,
        panImageUrl: null,
        plan: "Basic",
      });
      setPreviews({
        aadharFrontUrl: null,
        aadharBackUrl: null,
        panImageUrl: null,
      });
      setStep(1);
    } catch (err) {
      console.log("❌ Full error object:", err);

      let message = "Failed to submit form";
      if (err?.data?.message) {
        message = err.data.message;
      } else if (err?.data?.errorMessages?.length) {
        message = err.data.errorMessages.map((e) => e.message).join(", ");
      } else if (err?.error) {
        message = err.error;
      }

      toast.error(`❌ ${message}`);
    }
  };

  if (subLoading) return <div>Loading...</div>;
  if (subError) return <div>Error fetching subscription plans</div>;

  return (
    <section className="min-h-screen bg-[#0B1730] py-4 px-4">
      <div className="max-w-3xl mx-auto p-6 shadow-xl bg-white/10 rounded-lg">
        {/* ✅ Stepper */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full font-semibold ${
                  step === i + 1
                    ? "bg-red-500 text-white"
                    : step > i + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <p
                className={`mt-2 text-sm ${
                  step === i + 1 ? "font-bold text-red-600" : "text-gray-600"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1 - Vendor Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              {[{ label: "Vendor Name", name: "vendorName", type: "text" },
                { label: "Business Type", name: "businessType", type: "text" },
                { label: "GST Number", name: "gstNumber", type: "text" },
                { label: "PAN Number", name: "panNumber", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" }].map((field) => (
                <div key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
                  />
                </div>
              ))}

              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
              />
            </div>
          )}

          {/* Step 2 - KYC Upload */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {[{ label: "Aadhar Front", name: "aadharFrontUrl" },
                { label: "Aadhar Back", name: "aadharBackUrl" },
                { label: "PAN Image", name: "panImageUrl" }].map((file) => (
                <div key={file.name}>
                  <label>{file.label}</label>
                  <input
                    type="file"
                    name={file.name}
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
                  />
                  {/* ✅ Preview */}
                  {previews[file.name] && (
                    <div className="mt-2 flex justify-start items-center gap-4 flex-wrap">
                      <img
                        src={previews[file.name]}
                        alt={file.label}
                        className="h-24 w-auto rounded-lg border border-gray-300 object-cover shadow-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 3 - Plan Purchase */}
          {step === 3 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn px-2">
              {subscriptionData?.map((plan) => (
                <label
                  key={plan._id}
                  className={`relative block rounded-2xl border transition-all duration-300 p-6 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 ${
                    formData.plan === plan.planName
                      ? "border-blue-500 bg-gradient-to-r from-blue-600/10 to-purple-600/10 ring-2 ring-blue-500"
                      : "border-gray-300 bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.planName}
                    checked={formData.plan === plan.planName}
                    onChange={handleChange}
                    className="absolute top-4 right-4 w-5 h-5 text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <div className="flex flex-col h-full justify-between">
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {plan.planName}
                    </h3>
                    <ul className="text-sm text-gray-300 space-y-1 mb-3">
                      {plan.planInclude.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-blue-400">✔</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <p className="text-xl font-semibold text-blue-400">
                        ₹{plan.planCost}
                      </p>
                      <p className="text-xs text-gray-400">{plan.duration}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Step 4 - Review */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Review Your Details
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-sm">
                <table className="min-w-full divide-y divide-gray-700 text-sm text-left">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-gray-200 font-medium">Field</th>
                      <th className="px-4 py-2 text-gray-200 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-900">
                    {Object.entries(formData).map(([key, value]) => (
                      <tr key={key} className="hover:bg-gray-700">
                        <td className="px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                        <td className="px-4 py-2">
                          {value instanceof File ? (
                            <span className="text-blue-400">{value.name}</span>
                          ) : (
                            <span className="text-gray-200">{value?.toString() || "-"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Previous
              </button>
            )}
            {step < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={vendorLoading}
                className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              >
                {vendorLoading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default BecomeAVendor;
