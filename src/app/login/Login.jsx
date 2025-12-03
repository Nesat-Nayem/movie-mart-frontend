"use client";
import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/Button";
import Link from "next/link";
import Image from "next/image";
import { signInWithGoogle } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/api";

const Login = () => {
  // Auth method: 'select' | 'phone' | 'phone-otp' | 'email-login' | 'email-register'
  const [authMethod, setAuthMethod] = useState("select");
  
  // Phone auth states
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef([]);
  
  // Email auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const logoUrl = "/assets/img/default-logo.png";

  // ============ PHONE AUTH HANDLERS ============
  
  // Handle OTP input
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[idx] = value.charAt(value.length - 1);
    setOtp(newOtp);

    if (idx < 5) {
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
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasted.length === 6) {
      setOtp(pasted);
      inputsRef.current[5].focus();
    }
  };

  // Request OTP
  const requestOtp = async () => {
    if (mobile.length !== 10) {
      toast.error("Please enter valid 10 digit mobile number");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("OTP sent successfully!");
        setAuthMethod("phone-otp");
        setTimer(30);
        // In development, show OTP (remove in production)
        if (data.data?.otp) {
          console.log("DEV OTP:", data.data.otp);
        }
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, otp: enteredOtp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Login successful!");
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        // Redirect to home or dashboard
        window.location.href = "/";
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    await requestOtp();
    inputsRef.current[0]?.focus();
  };

  // Countdown timer
  useEffect(() => {
    if (authMethod === "phone-otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [authMethod, timer]);

  // ============ EMAIL AUTH HANDLERS ============
  
  // Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        window.location.href = "/";
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Email Register
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Registration successful! Please login.");
        setAuthMethod("email-login");
        // Clear form
        setName("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ============ GOOGLE AUTH HANDLER ============
  
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        toast.error(result.error || "Google sign in failed");
        return;
      }
      
      // Send Firebase token to backend
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: result.idToken }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        window.location.href = "/";
      } else {
        toast.error(data.message || "Google authentication failed");
      }
    } catch (error) {
      toast.error("Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ============ RENDER ============
  
  const renderAuthSelect = () => (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
      <p className="text-gray-400 text-center mb-6">Choose how you want to login</p>
      
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {googleLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <FcGoogle className="text-xl" />
        )}
        Continue with Google
      </button>
      
      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-600"></div>
        <span className="text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>
      
      {/* Phone Login Button */}
      <button
        onClick={() => setAuthMethod("phone")}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
      >
        <FaPhone />
        Login with Phone Number
      </button>
      
      {/* Email Login Button */}
      <button
        onClick={() => setAuthMethod("email-login")}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
      >
        <FaEnvelope />
        Login with Email
      </button>
      
      {/* Register Link */}
      <p className="text-center text-gray-400 mt-6 text-sm">
        Don't have an account?{" "}
        <button
          onClick={() => setAuthMethod("email-register")}
          className="text-pink-400 hover:underline font-medium"
        >
          Register
        </button>
      </p>
    </>
  );

  const renderPhoneAuth = () => (
    <>
      <button
        onClick={() => { setAuthMethod("select"); setMobile(""); }}
        className="text-gray-400 hover:text-white mb-4 text-sm"
      >
        ← Back to options
      </button>
      
      <h1 className="text-xl font-bold mb-4">Login with Phone</h1>
      <p className="text-gray-400 text-sm mb-4">We'll send you an OTP via WhatsApp/SMS</p>
      
      <label className="block text-sm text-gray-300 mb-2">Mobile Number</label>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-2 bg-gray-700 rounded-lg text-gray-300">+91</span>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 10) setMobile(val);
          }}
          placeholder="Enter 10 digit number"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
      </div>
      
      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={requestOtp}
        disabled={mobile.length !== 10 || loading}
      >
        {loading ? "Sending..." : "Get OTP"}
      </Button>
    </>
  );

  const renderPhoneOtp = () => (
    <>
      <button
        onClick={() => { setAuthMethod("phone"); setOtp(["", "", "", "", "", ""]); }}
        className="text-gray-400 hover:text-white mb-4 text-sm"
      >
        ← Change Number
      </button>
      
      <h1 className="text-xl font-bold mb-2">Verify OTP</h1>
      <p className="mb-4 text-sm text-gray-400">
        Enter the 6-digit OTP sent to <span className="text-white font-semibold">+91 {mobile}</span>
      </p>

      <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-11 h-12 text-center text-lg font-bold rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
          />
        ))}
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={verifyOtp}
        disabled={otp.some((digit) => !digit) || loading}
      >
        {loading ? "Verifying..." : "Verify & Login"}
      </Button>

      <div className="text-center mt-4 text-sm">
        {timer > 0 ? (
          <span className="text-gray-400">Resend OTP in {timer}s</span>
        ) : (
          <button onClick={resendOtp} className="text-pink-400 hover:underline">
            Resend OTP
          </button>
        )}
      </div>
    </>
  );

  const renderEmailLogin = () => (
    <>
      <button
        onClick={() => { setAuthMethod("select"); setEmail(""); setPassword(""); }}
        className="text-gray-400 hover:text-white mb-4 text-sm"
      >
        ← Back to options
      </button>
      
      <h1 className="text-xl font-bold mb-4">Login with Email</h1>
      
      <form onSubmit={handleEmailLogin}>
        <label className="block text-sm text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        
        <label className="block text-sm text-gray-300 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2 mb-6 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        
        <Button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      
      <p className="text-center text-gray-400 mt-4 text-sm">
        Don't have an account?{" "}
        <button
          onClick={() => setAuthMethod("email-register")}
          className="text-pink-400 hover:underline"
        >
          Register
        </button>
      </p>
    </>
  );

  const renderEmailRegister = () => (
    <>
      <button
        onClick={() => { setAuthMethod("select"); }}
        className="text-gray-400 hover:text-white mb-4 text-sm"
      >
        ← Back to options
      </button>
      
      <h1 className="text-xl font-bold mb-4">Create Account</h1>
      
      <form onSubmit={handleEmailRegister}>
        <label className="block text-sm text-gray-300 mb-2">Full Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        
        <label className="block text-sm text-gray-300 mb-2">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        
        <label className="block text-sm text-gray-300 mb-2">Phone Number *</label>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-2 bg-gray-700 rounded-lg text-gray-300">+91</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 10) setPhone(val);
            }}
            placeholder="10 digit number"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        
        <label className="block text-sm text-gray-300 mb-2">Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 6 characters"
          className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        
        <label className="block text-sm text-gray-300 mb-2">Confirm Password *</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-4 py-2 mb-6 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        
        <Button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>
      
      <p className="text-center text-gray-400 mt-4 text-sm">
        Already have an account?{" "}
        <button
          onClick={() => setAuthMethod("email-login")}
          className="text-pink-400 hover:underline"
        >
          Login
        </button>
      </p>
    </>
  );

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0B1730] text-white px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src={logoUrl}
              alt="Logo"
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>

        {authMethod === "select" && renderAuthSelect()}
        {authMethod === "phone" && renderPhoneAuth()}
        {authMethod === "phone-otp" && renderPhoneOtp()}
        {authMethod === "email-login" && renderEmailLogin()}
        {authMethod === "email-register" && renderEmailRegister()}
      </div>
    </section>
  );
};

export default Login;
