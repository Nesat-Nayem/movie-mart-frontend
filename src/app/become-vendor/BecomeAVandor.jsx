"use client";  

import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { load } from "@cashfreepayments/cashfree-js";
import { FaMapMarkerAlt } from "react-icons/fa";
import { 
  useGetVendorPackagesQuery, 
  useGetPlatformSettingsQuery, 
  useCreateVendorApplicationMutation,
  useCreatePaymentOrderMutation,
  useLazyVerifyPaymentQuery,
} from "../../../store/becomeVendorApi";
import { detectUserCountry, getPriceForCountry } from "@/services/geolocationService";
import { getCountryByCode } from "@/data/countries";

const BecomeAVendor = () => {
  const [step, setStep] = useState(1);
  const [cashfree, setCashfree] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userCountry, setUserCountry] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // ✅ Initialize Cashfree SDK
  useEffect(() => {
    const initCashfree = async () => {
      const cf = await load({ mode: "sandbox" }); // Change to "production" for live
      setCashfree(cf);
    };
    initCashfree();
  }, []);

  // ✅ Detect user's country for location-based pricing
  useEffect(() => {
    const detectCountry = async () => {
      try {
        setLocationLoading(true);
        const country = await detectUserCountry(false, true);
        setUserCountry(country);
        // Update form country based on detected location
        if (country?.countryCode) {
          setFormData(prev => ({ ...prev, country: country.countryCode }));
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
        setUserCountry({ countryCode: 'IN', currency: 'INR', currencySymbol: '₹', flag: '🇮🇳' });
      } finally {
        setLocationLoading(false);
      }
    };
    detectCountry();
  }, []);

  // Helper function to get package price for user's country
  const getPackagePrice = (pkg) => {
    if (!pkg) return { price: 0, currency: 'INR', currencySymbol: '₹' };
    
    // Check if package has country-wise pricing
    const countryPricing = pkg.countryPricing || [];
    const userCountryCode = userCountry?.countryCode || 'IN';
    
    // Find pricing for user's country
    const countryPrice = countryPricing.find(
      cp => cp.countryCode === userCountryCode && cp.isActive
    );
    
    if (countryPrice) {
      const countryData = getCountryByCode(countryPrice.countryCode);
      return {
        price: countryPrice.price,
        currency: countryPrice.currency,
        currencySymbol: countryData?.currencySymbol || countryPrice.currency,
      };
    }
    
    // Default to base price (INR)
    return {
      price: pkg.price,
      currency: 'INR',
      currencySymbol: '₹',
    };
  };

  // ✅ Fetch packages and settings
  const { data: packages = [], isLoading: packagesLoading } = useGetVendorPackagesQuery();
  const { data: platformSettings = [], isLoading: settingsLoading } = useGetPlatformSettingsQuery();
  const [createVendor, { isLoading: vendorLoading }] = useCreateVendorApplicationMutation();
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useLazyVerifyPaymentQuery();

  // Get platform fees
  const eventFee = useMemo(() => {
    const setting = platformSettings.find(s => s.key === 'event_platform_fee');
    return setting?.value || 20;
  }, [platformSettings]);

  const movieWatchFee = useMemo(() => {
    const setting = platformSettings.find(s => s.key === 'movie_watch_platform_fee');
    return setting?.value || 50;
  }, [platformSettings]);

  // ✅ Form Data
  const [formData, setFormData] = useState({
    vendorName: "",
    businessType: "",
    gstNumber: "",
    country: "IN",
    address: "",
    email: "",
    phone: "",
    // India specific
    aadharFrontUrl: null,
    aadharBackUrl: null,
    panImageUrl: null,
    // International
    nationalIdUrl: null,
    passportUrl: null,
  });

  // ✅ Selected Services
  const [selectedServices, setSelectedServices] = useState({
    film_trade: false,
    events: false,
    movie_watch: false,
  });
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // ✅ Previews
  const [previews, setPreviews] = useState({
    aadharFrontUrl: null,
    aadharBackUrl: null,
    panImageUrl: null,
    nationalIdUrl: null,
    passportUrl: null,
  });

  // Check if country is India
  const isIndia = formData.country === 'IN';

  const steps = ["Vendor Info", "KYC Upload", "Select Services", "Review"];

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

  // ✅ Step Validation
  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1: // Vendor Info
        if (!formData.vendorName.trim()) {
          toast.error("Please enter your name");
          return false;
        }
        if (!formData.businessType.trim()) {
          toast.error("Please enter your business name");
          return false;
        }
        if (!formData.email.trim()) {
          toast.error("Please enter your email");
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        if (!formData.phone.trim()) {
          toast.error("Please enter your phone number");
          return false;
        }
        // Phone validation (at least 10 digits)
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          toast.error("Please enter a valid phone number (at least 10 digits)");
          return false;
        }
        if (!formData.address.trim()) {
          toast.error("Please enter your address");
          return false;
        }
        return true;

      case 2: // KYC Upload - Optional, so always valid
        return true;

      case 3: // Select Services
        if (!selectedServices.film_trade && !selectedServices.events && !selectedServices.movie_watch) {
          toast.error("Please select at least one service");
          return false;
        }
        if (selectedServices.film_trade && !selectedPackageId) {
          toast.error("Please select a Film Trade package");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // ✅ Navigation
  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!selectedServices.film_trade) return 0;
    const pkg = packages.find(p => p._id === selectedPackageId);
    return pkg?.price || 0;
  }, [selectedServices.film_trade, selectedPackageId, packages]);

  // Check if any service is selected
  const hasSelectedService = selectedServices.film_trade || selectedServices.events || selectedServices.movie_watch;

  // ✅ Submit form after payment (or directly if no payment needed)
  const submitApplication = async (paymentInfo = null) => {
    try {
      const form = new FormData();
      
      // Add basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") form.append(key, value);
      });

      // Build selected services array
      const services = [];
      if (selectedServices.film_trade && selectedPackageId) {
        services.push({ serviceType: 'film_trade', packageId: selectedPackageId });
      }
      if (selectedServices.events) {
        services.push({ serviceType: 'events' });
      }
      if (selectedServices.movie_watch) {
        services.push({ serviceType: 'movie_watch' });
      }
      
      form.append('selectedServices', JSON.stringify(services));

      // Add payment info if provided
      if (paymentInfo) {
        form.append('paymentInfo', JSON.stringify(paymentInfo));
      }

      const res = await createVendor(form).unwrap();
      console.log("Vendor Application Submitted ✅:", res);
      toast.success("🎉 Application submitted successfully! Check your email for confirmation.");

      // Reset form
      setFormData({
        vendorName: "",
        businessType: "",
        gstNumber: "",
        country: "IN",
        address: "",
        email: "",
        phone: "",
        aadharFrontUrl: null,
        aadharBackUrl: null,
        panImageUrl: null,
        nationalIdUrl: null,
        passportUrl: null,
      });
      setSelectedServices({ film_trade: false, events: false, movie_watch: false });
      setSelectedPackageId(null);
      setPreviews({
        aadharFrontUrl: null,
        aadharBackUrl: null,
        panImageUrl: null,
        nationalIdUrl: null,
        passportUrl: null,
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

  // ✅ Handle Cashfree Payment
  const handlePayment = async () => {
    if (!cashfree) {
      toast.error("Payment system not loaded. Please refresh the page.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create payment order
      const orderRes = await createPaymentOrder({
        packageId: selectedPackageId,
        customerDetails: {
          name: formData.vendorName,
          email: formData.email,
          phone: formData.phone,
        },
        returnUrl: `${window.location.origin}/become-vendor`,
      }).unwrap();

      const { sessionId, orderId, orderAmount } = orderRes.data;

      // Open Cashfree checkout
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.error("Payment error:", result.error);
          toast.error("Payment failed. Please try again.");
          setIsProcessingPayment(false);
          return;
        }

        if (result.paymentDetails) {
          // Verify payment
          const verifyRes = await verifyPayment(orderId);
          
          if (verifyRes?.data?.data?.isPaid) {
            toast.success("Payment successful! Submitting your application...");
            
            // Submit form with payment info
            await submitApplication({
              status: 'completed',
              amount: orderAmount,
              transactionId: orderId,
              paymentMethod: 'cashfree',
            });
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        }
        setIsProcessingPayment(false);
      });

    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.data?.message || "Failed to initiate payment");
      setIsProcessingPayment(false);
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasSelectedService) {
      toast.error("Please select at least one service");
      return;
    }

    if (selectedServices.film_trade && !selectedPackageId) {
      toast.error("Please select a Film Trade package");
      return;
    }

    // If Film Trade is selected, process payment first
    if (selectedServices.film_trade && totalAmount > 0) {
      await handlePayment();
    } else {
      // No payment needed, submit directly
      await submitApplication();
    }
  };

  if (packagesLoading || settingsLoading) return <div className="min-h-screen bg-[#0B1730] flex items-center justify-center text-white">Loading...</div>;

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
              {[{ label: "Name", name: "vendorName", type: "text", required: true },
                { label: "Business Name", name: "businessType", type: "text", required: true },
                { label: "GST Number (Optional)", name: "gstNumber", type: "text", required: false },
                { label: "Email", name: "email", type: "email", required: true },
                { label: "Phone", name: "phone", type: "text", required: true }].map((field) => (
                <div key={field.name}>
                  <label className="text-gray-300">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
                  />
                </div>
              ))}

              {/* Country Selection */}
              <div>
                <label>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="SG">Singapore</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <label className="text-gray-300">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
              />
            </div>
          )}

          {/* Step 2 - KYC Upload */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-gray-400 text-sm mb-4">
                {isIndia 
                  ? "Upload your Aadhar and PAN documents for verification (optional but recommended)."
                  : "Upload your National ID or Passport for verification (optional but recommended)."}
              </p>

              {isIndia ? (
                <>
                  {/* India - Aadhar & PAN */}
                  {[{ label: "Aadhar Front (Optional)", name: "aadharFrontUrl" },
                    { label: "Aadhar Back (Optional)", name: "aadharBackUrl" },
                    { label: "PAN Card (Optional)", name: "panImageUrl" }].map((file) => (
                    <div key={file.name}>
                      <label>{file.label}</label>
                      <input
                        type="file"
                        name={file.name}
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
                      />
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
                </>
              ) : (
                <>
                  {/* International - National ID & Passport */}
                  {[{ label: "National ID Card (Optional)", name: "nationalIdUrl" },
                    { label: "Passport (Optional)", name: "passportUrl" }].map((file) => (
                    <div key={file.name}>
                      <label>{file.label}</label>
                      <input
                        type="file"
                        name={file.name}
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-400 text-xs py-3 px-2 rounded"
                      />
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
                </>
              )}
            </div>
          )}

          {/* Step 3 - Select Services */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-gray-300 text-sm mb-4">
                Select the services you want to offer on MovieMart. You can choose one or more services.
              </p>

              {/* Film Trade Service */}
              <div className={`rounded-2xl border-2 p-5 transition-all ${selectedServices.film_trade ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-white/5'}`}>
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedServices.film_trade}
                    onChange={(e) => {
                      setSelectedServices(prev => ({ ...prev, film_trade: e.target.checked }));
                      if (!e.target.checked) setSelectedPackageId(null);
                    }}
                    className="w-5 h-5 mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      🎬 Film Trade
                      <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">Requires Package</span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      List and sell your movies on our platform. Choose a package below.
                    </p>
                    
                    {selectedServices.film_trade && (
                      <div className="mt-4">
                        {!selectedPackageId && (
                          <p className="text-red-400 text-sm mb-3 flex items-center gap-2">
                            <span>⚠️</span> Please select a package to continue
                          </p>
                        )}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {packages.map((pkg) => (
                          <label
                            key={pkg._id}
                            className={`relative block rounded-xl border p-4 cursor-pointer transition-all ${
                              selectedPackageId === pkg._id
                                ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-400'
                                : 'border-gray-500 bg-white/5 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="package"
                              checked={selectedPackageId === pkg._id}
                              onChange={() => setSelectedPackageId(pkg._id)}
                              className="absolute top-3 right-3 w-4 h-4 accent-blue-500"
                            />
                            {pkg.isPopular && (
                              <span className="absolute -top-2 left-3 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-semibold">
                                Popular
                              </span>
                            )}
                            <h4 className="font-bold text-white">{pkg.name}</h4>
                            <p className="text-2xl font-bold text-blue-400 my-2">
                              {(() => {
                                const priceInfo = getPackagePrice(pkg);
                                return `${priceInfo.currencySymbol}${priceInfo.price?.toLocaleString()}`;
                              })()}
                            </p>
                            <p className="text-xs text-gray-400">{pkg.duration} {pkg.durationType}</p>
                            <ul className="mt-2 space-y-1">
                              {pkg.features?.slice(0, 3).map((f, i) => (
                                <li key={i} className="text-xs text-gray-300 flex items-center gap-1">
                                  <span className="text-green-400">✓</span> {f}
                                </li>
                              ))}
                            </ul>
                          </label>
                        ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Events Service */}
              <div className={`rounded-2xl border-2 p-5 transition-all ${selectedServices.events ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-600 bg-white/5'}`}>
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedServices.events}
                    onChange={(e) => setSelectedServices(prev => ({ ...prev, events: e.target.checked }))}
                    className="w-5 h-5 mt-1 accent-yellow-500"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      🎭 Events
                      <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">No Upfront Cost</span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Host and sell tickets for your events, concerts, and shows.
                    </p>
                    <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg">
                      <p className="text-yellow-400 font-semibold">Platform Fee: {eventFee}%</p>
                      <p className="text-xs text-gray-400">Deducted from each ticket sale</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Watch Service */}
              <div className={`rounded-2xl border-2 p-5 transition-all ${selectedServices.movie_watch ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 bg-white/5'}`}>
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedServices.movie_watch}
                    onChange={(e) => setSelectedServices(prev => ({ ...prev, movie_watch: e.target.checked }))}
                    className="w-5 h-5 mt-1 accent-cyan-500"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      🎥 Movie Watch
                      <span className="text-xs bg-cyan-500 text-black px-2 py-1 rounded-full">No Upfront Cost</span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Stream your movies for viewers to rent or purchase.
                    </p>
                    <div className="mt-3 p-3 bg-cyan-500/10 rounded-lg">
                      <p className="text-cyan-400 font-semibold">Platform Fee: {movieWatchFee}%</p>
                      <p className="text-xs text-gray-400">Deducted from each movie sale/rental</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              {hasSelectedService && (
                <div className="mt-6 p-4 bg-white/10 rounded-xl border border-gray-500">
                  <h4 className="font-bold text-white mb-2">Summary</h4>
                  <div className="space-y-2 text-sm">
                    {selectedServices.film_trade && selectedPackageId && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Film Trade Package</span>
                        <span className="text-white font-semibold">
                          {userCountry?.currencySymbol || '₹'}{totalAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedServices.events && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Events Service</span>
                        <span className="text-green-400">Free ({eventFee}% per sale)</span>
                      </div>
                    )}
                    {selectedServices.movie_watch && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Movie Watch Service</span>
                        <span className="text-green-400">Free ({movieWatchFee}% per sale)</span>
                      </div>
                    )}
                    <hr className="border-gray-600 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total Due Now</span>
                      <span className="text-blue-400">
                        {userCountry?.currencySymbol || '₹'}{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4 - Review */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Review Your Application
              </h3>
              
              {/* Vendor Info */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  👤 Vendor Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">Name:</span> <span className="text-white">{formData.vendorName}</span></div>
                  <div><span className="text-gray-400">Business:</span> <span className="text-white">{formData.businessType}</span></div>
                  <div><span className="text-gray-400">Email:</span> <span className="text-white">{formData.email}</span></div>
                  <div><span className="text-gray-400">Phone:</span> <span className="text-white">{formData.phone}</span></div>
                  <div><span className="text-gray-400">Country:</span> <span className="text-white">{formData.country}</span></div>
                  <div><span className="text-gray-400">GST:</span> <span className="text-white">{formData.gstNumber || 'N/A'}</span></div>
                  <div className="col-span-2"><span className="text-gray-400">Address:</span> <span className="text-white">{formData.address}</span></div>
                </div>
              </div>

              {/* KYC Documents */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  📄 KYC Documents
                </h4>
                <div className="flex gap-4 flex-wrap">
                  {isIndia ? (
                    <>
                      {formData.aadharFrontUrl && <div className="text-center"><span className="text-xs text-gray-400 block mb-1">Aadhar Front</span><span className="text-green-400">✓ Uploaded</span></div>}
                      {formData.aadharBackUrl && <div className="text-center"><span className="text-xs text-gray-400 block mb-1">Aadhar Back</span><span className="text-green-400">✓ Uploaded</span></div>}
                      {formData.panImageUrl && <div className="text-center"><span className="text-xs text-gray-400 block mb-1">PAN Card</span><span className="text-green-400">✓ Uploaded</span></div>}
                      {!formData.aadharFrontUrl && !formData.aadharBackUrl && !formData.panImageUrl && <span className="text-gray-500">No documents uploaded</span>}
                    </>
                  ) : (
                    <>
                      {formData.nationalIdUrl && <div className="text-center"><span className="text-xs text-gray-400 block mb-1">National ID</span><span className="text-green-400">✓ Uploaded</span></div>}
                      {formData.passportUrl && <div className="text-center"><span className="text-xs text-gray-400 block mb-1">Passport</span><span className="text-green-400">✓ Uploaded</span></div>}
                      {!formData.nationalIdUrl && !formData.passportUrl && <span className="text-gray-500">No documents uploaded</span>}
                    </>
                  )}
                </div>
              </div>

              {/* Selected Services */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  🎯 Selected Services
                </h4>
                <div className="space-y-3">
                  {selectedServices.film_trade && (
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div>
                        <span className="text-blue-400 font-semibold">🎬 Film Trade</span>
                        {selectedPackageId && (
                          <span className="ml-2 text-sm text-gray-300">
                            ({packages.find(p => p._id === selectedPackageId)?.name} Package)
                          </span>
                        )}
                      </div>
                      <span className="text-white font-bold">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedServices.events && (
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <span className="text-yellow-400 font-semibold">🎭 Events</span>
                      <span className="text-green-400">Free ({eventFee}% fee)</span>
                    </div>
                  )}
                  {selectedServices.movie_watch && (
                    <div className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                      <span className="text-cyan-400 font-semibold">🎥 Movie Watch</span>
                      <span className="text-green-400">Free ({movieWatchFee}% fee)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              {totalAmount > 0 && (
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">Total Payment</span>
                    <span className="text-2xl font-bold text-blue-400">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Payment will be processed after submission. You'll receive a confirmation email.
                  </p>
                </div>
              )}
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
                disabled={vendorLoading || isProcessingPayment}
                className={`ml-auto px-6 py-3 text-white rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedServices.film_trade && totalAmount > 0
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-green-500 hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessingPayment 
                  ? "Processing Payment..." 
                  : vendorLoading 
                    ? "Submitting..." 
                    : selectedServices.film_trade && totalAmount > 0
                      ? `Pay ₹${totalAmount.toLocaleString()} & Submit`
                      : "Submit Application"
                }
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default BecomeAVendor;
