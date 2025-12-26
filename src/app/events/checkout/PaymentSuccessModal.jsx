"use client";

import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTicketAlt, FaHome } from "react-icons/fa";
import { useEffect } from "react";

const PaymentSuccessModal = ({ isOpen, bookingData, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleViewTicket = () => {
    router.push('/profile-settings/event-ticket');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1a2744] to-[#0B1730] rounded-2xl shadow-2xl max-w-md w-full p-8 border border-pink-500/20 animate-scaleIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-400 text-sm">
            Your ticket has been booked successfully
          </p>
        </div>

        {/* Booking Details */}
        {bookingData && (
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Event</span>
                <span className="text-white font-medium text-sm">
                  {bookingData.event?.title || 'Event'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Tickets</span>
                <span className="text-white font-medium text-sm">
                  {bookingData.booking?.quantity || 1} x {bookingData.booking?.seatType || 'Normal'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Booking ID</span>
                <span className="text-pink-400 font-mono text-xs">
                  {bookingData.booking?.bookingReference || bookingData.booking?._id}
                </span>
              </div>
              {bookingData.eTickets && bookingData.eTickets.length > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-gray-400 text-sm">E-Tickets</span>
                  <span className="text-green-400 font-medium text-sm flex items-center gap-1">
                    <FaCheckCircle className="text-xs" />
                    Generated
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewTicket}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-500/50"
          >
            <FaTicketAlt />
            View My Tickets
          </button>
          
          <button
            onClick={handleBackToHome}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
          >
            <FaHome />
            Back to Home
          </button>
        </div>

        {/* Confirmation Email Note */}
        <p className="text-center text-gray-500 text-xs mt-4">
          A confirmation email has been sent to your registered email address
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessModal;
