"use client";
import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/Button";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef([]);
  const logoUrl ="/assets/img/default-logo.png";

  // Handle OTP input
  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, ""); // only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[idx] = value.charAt(value.length - 1);
    setOtp(newOtp);

    // Move to next
    if (idx < 3) {
      inputsRef.current[idx + 1].focus();
    }
  };

  // Backspace navigation
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  // Paste handling
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 4).split("");
    if (pasted.length === 4) {
      setOtp(pasted);
      inputsRef.current[3].focus();
    }
  };

  // Verify OTP
  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    alert(`OTP entered: ${enteredOtp}`);
  };

  // Resend OTP
  const resendOtp = () => {
    setOtp(["", "", "", ""]);
    setTimer(30);
    inputsRef.current[0].focus();
    alert("OTP resent!");
  };

  // Countdown timer
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B1730] text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
          <Link href="/">
              <Image
                src={logoUrl}
                alt="Logo"
                width={55}
                height={55}
                style={{ objectFit: "contain" }}
              />
        </Link>
        <h1 className="text-xl font-bold mb-4">Login with Mobile</h1>

        {step === 1 && (
          <>
            <label className="block text-sm text-gray-300 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/, ""); // numbers only
                if (val.length <= 10) setMobile(val);
              }}
              placeholder="Enter 10 digit mobile number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <Button
              className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
              onClick={() => setStep(2)}
              disabled={mobile.length !== 10}
            >
              Get OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-4 text-sm text-gray-300">
              Enter the 4-digit OTP sent to{" "}
              <span className="font-semibold">{mobile}</span>
            </p>

            <div className="flex justify-between gap-3" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-14 h-14 text-center text-lg font-bold rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              ))}
            </div>

            <Button
              className="w-full mt-6 bg-pink-600 hover:bg-pink-700"
              onClick={verifyOtp}
              disabled={otp.some((digit) => !digit)}
            >
              Verify OTP
            </Button>

            <div className="flex items-center justify-between mt-4 text-xs">
              <button
                onClick={() => {
                  setOtp(["", "", "", ""]); // clear OTP when going back
                  setStep(1);
                }}
                className="text-gray-400 hover:underline"
              >
                ← Back
              </button>

              {timer > 0 ? (
                <span className="text-gray-400">Resend OTP in {timer}s</span>
              ) : (
                <button
                  onClick={resendOtp}
                  className="text-pink-400 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Login;
