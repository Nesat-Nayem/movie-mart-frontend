"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaDownload, FaHome, FaSpinner } from "react-icons/fa";
import { useLazyGetPaymentStatusQuery } from "../../../../../store/eventsApi";
import Button from "@/app/components/Button";
import Image from "next/image";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  
  const [getPaymentStatus, { data: paymentData, isLoading, isError }] = useLazyGetPaymentStatusQuery();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (orderId) {
      getPaymentStatus(orderId);
    } else {
      // Try to get from localStorage
      const storedOrderId = localStorage.getItem("pendingOrderId");
      if (storedOrderId) {
        getPaymentStatus(storedOrderId);
      }
    }
  }, [orderId, getPaymentStatus]);

  // Retry if payment is still pending
  useEffect(() => {
    if (paymentData?.booking?.paymentStatus === "pending" && retryCount < 5) {
      const timer = setTimeout(() => {
        getPaymentStatus(orderId || localStorage.getItem("pendingOrderId"));
        setRetryCount((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentData, retryCount, orderId, getPaymentStatus]);

  // Clean up localStorage on successful payment
  useEffect(() => {
    if (paymentData?.booking?.paymentStatus === "completed") {
      localStorage.removeItem("pendingEventBooking");
      localStorage.removeItem("pendingOrderId");
      localStorage.removeItem("pendingBookingId");
    }
  }, [paymentData]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (isLoading || (paymentData?.booking?.paymentStatus === "pending" && retryCount < 5)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verifying Payment...</h2>
          <p className="text-gray-400">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (isError || !paymentData?.booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
            <FaSpinner className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Payment Processing</h2>
          <p className="text-gray-400 mb-6">
            Your payment is being processed. You will receive a confirmation email shortly.
          </p>
          <Link href="/events">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
              <FaHome className="mr-2" /> Browse Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { booking, eTicket } = paymentData;
  const event = booking.eventId;

  if (booking.paymentStatus !== "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Payment Failed</h2>
          <p className="text-gray-400 mb-6">
            Unfortunately, your payment could not be processed. Please try again.
          </p>
          <Link href="/events">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
              Try Again
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <FaCheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your tickets have been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white/5 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden">
          {/* Event Banner */}
          {event?.posterImage && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={event.posterImage}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1730] via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6">
            {/* Event Title */}
            <h2 className="text-2xl font-bold text-white mb-4">{event?.title}</h2>

            {/* Booking Reference */}
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-xl p-4 mb-6 border border-pink-500/30">
              <p className="text-gray-400 text-sm">Booking Reference</p>
              <p className="text-2xl font-mono font-bold text-pink-400">{booking.bookingReference}</p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-pink-400 mb-2">
                  <FaCalendarAlt />
                  <span className="text-sm font-medium">Date & Time</span>
                </div>
                <p className="text-white font-semibold">{formatDate(event?.startDate)}</p>
                <p className="text-gray-400 text-sm">{formatTime(event?.startTime)}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-pink-400 mb-2">
                  <FaMapMarkerAlt />
                  <span className="text-sm font-medium">Venue</span>
                </div>
                <p className="text-white font-semibold">{event?.location?.venueName}</p>
                <p className="text-gray-400 text-sm line-clamp-1">{event?.location?.city}</p>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-pink-400 mb-3">
                <FaTicketAlt />
                <span className="font-medium">Ticket Details</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Tickets</p>
                  <p className="text-white font-bold text-xl">{booking.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="text-white font-bold">{booking.seatType}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount Paid</p>
                  <p className="text-green-400 font-bold text-xl">₹{booking.finalAmount}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {eTicket?.qrCodeImageUrl && (
              <div className="flex flex-col items-center mb-6">
                <p className="text-gray-400 text-sm mb-3">Scan this QR code at the venue</p>
                <div className="bg-white p-4 rounded-2xl">
                  <img
                    src={eTicket.qrCodeImageUrl}
                    alt="Ticket QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">Ticket: {eTicket.ticketNumber}</p>
              </div>
            )}

            {/* Customer Details */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Booked By</p>
              <p className="text-white font-semibold">{booking.customerDetails?.name}</p>
              <p className="text-gray-400 text-sm">{booking.customerDetails?.email}</p>
              <p className="text-gray-400 text-sm">{booking.customerDetails?.phone}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                onClick={() => {
                  // Download ticket logic
                  const link = document.createElement("a");
                  link.href = eTicket?.qrCodeImageUrl || "";
                  link.download = `ticket-${booking.bookingReference}.png`;
                  link.click();
                }}
              >
                <FaDownload className="mr-2" /> Download Ticket
              </Button>
              <Link href="/events" className="flex-1">
                <Button className="w-full bg-white/10 hover:bg-white/20 border border-gray-600">
                  <FaHome className="mr-2" /> Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>A confirmation email has been sent to {booking.customerDetails?.email}</p>
          <p className="mt-1">For any queries, contact support@moviemart.com</p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
