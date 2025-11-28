"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const Checkout = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    message: "",
  });
  const [amount, setAmount] = useState(500); // 💰 Change to dynamic amount if needed

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Razorpay payment
  const handlePayment = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // 🔑 add in .env.local
      amount: amount * 100, // amount in paise
      currency: "INR",
      name: "Film Mart",
      description: form.purpose || "Ticket Booking",
      image: "/logo.png", // optional logo
      handler: function (response) {
        alert(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );
        router.push("/success"); // redirect after success
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        purpose: form.purpose,
        message: form.message,
      },
      theme: {
        color: "#f43f5e", // pink-600
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <section className="py-2">
      <div className="max-w-sm mx-auto shadow-2xl border border-gray-700 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="p-2 rounded-full bg-white/10 cursor-pointer"
            onClick={() => router.push("/film-mart-details")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-lg font-semibold">Checkout</h1>
        </div>

        {/* form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium text-sm mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-400 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-400 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block font-medium text-sm mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-400 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="eventName"
              className="block font-medium text-sm mb-2"
            >
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Enter eventName"
              className="w-full p-2 border border-gray-400 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block font-medium text-sm mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-400 rounded-md"
              placeholder="Enter your message"
            ></textarea>
          </div>
        </form>

        {/* Show Amount */}
        <div className="flex justify-between items-center mt-4 font-semibold">
          <span>Total Amount:</span>
          <span>₹{amount}</span>
        </div>

        {/* Button */}
        <Button className="w-full mt-6" onClick={handlePayment}>
          Pay ₹{amount}
        </Button>
      </div>
    </section>
  );
};

export default Checkout;
