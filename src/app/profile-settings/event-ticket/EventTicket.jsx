"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { 
  FaArrowLeft, 
  FaTicketAlt, 
  FaDownload, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaChevronRight,
  FaTimes,
  FaInfoCircle
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useGetUserBookingsQuery, useGetETicketQuery } from "../../../../store/eventsApi";
import Image from "next/image";

const EventTicket = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const ticketRef = useRef(null);

  // Fetch user bookings
  const { data: bookingsData, isLoading, isError, refetch } = useGetUserBookingsQuery(user?._id, {
    skip: !user?._id,
  });

  const bookings = bookingsData?.bookings || [];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
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

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return { bg: "bg-green-500/20", text: "text-green-400", icon: FaCheckCircle };
      case "pending":
        return { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: FaHourglassHalf };
      case "cancelled":
      case "failed":
        return { bg: "bg-red-500/20", text: "text-red-400", icon: FaTimesCircle };
      default:
        return { bg: "bg-gray-500/20", text: "text-gray-400", icon: FaInfoCircle };
    }
  };

  // Download ticket as image
  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    
    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `event-ticket-${selectedBooking?.bookingReference || "ticket"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error downloading ticket:", error);
      // Fallback - download QR code
      if (selectedBooking?.eTicket?.qrCodeImageUrl) {
        const link = document.createElement("a");
        link.download = `ticket-qr-${selectedBooking?.bookingReference}.png`;
        link.href = selectedBooking.eTicket.qrCodeImageUrl;
        link.click();
      }
    }
  };

  // Handle view ticket
  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setShowTicketModal(true);
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] py-8">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center py-20">
            <FaTicketAlt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-gray-400 mb-6">Please login to view your tickets</p>
            <Button 
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Login Now
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] py-6">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
            onClick={() => router.push("/profile-settings")}
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">My Event Tickets</h1>
            <p className="text-gray-400 text-sm">{bookings.length} ticket(s) found</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your tickets...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <FaTicketAlt className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Tickets Found</h2>
            <p className="text-gray-400 mb-6">You haven't booked any event tickets yet</p>
            <Button 
              onClick={() => router.push("/events")}
              className="bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Explore Events
            </Button>
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const event = booking.eventId;
              const status = getStatusStyle(booking.paymentStatus);
              const StatusIcon = status.icon;

              return (
                <div
                  key={booking._id}
                  className="bg-white/5 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all cursor-pointer"
                  onClick={() => handleViewTicket(booking)}
                >
                  <div className="flex gap-4 p-4">
                    {/* Event Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      {event?.posterImage ? (
                        <Image
                          src={event.posterImage}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center">
                          <FaTicketAlt className="text-white/50 w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base line-clamp-1">
                        {event?.title || "Event"}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                        <FaCalendarAlt className="text-pink-400" />
                        <span>{formatDate(event?.startDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                        <FaMapMarkerAlt className="text-pink-400" />
                        <span className="line-clamp-1">{event?.location?.venueName}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${status.bg}`}>
                          <StatusIcon className={`w-3 h-3 ${status.text}`} />
                          <span className={`text-xs font-medium ${status.text} capitalize`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                        <span className="text-white font-semibold">
                          {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <FaChevronRight className="text-gray-500" />
                    </div>
                  </div>

                  {/* Booking Reference */}
                  <div className="px-4 py-2 bg-black/20 border-t border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Ref: {booking.bookingReference}</span>
                      <span className="text-green-400 text-xs font-medium">₹{booking.finalAmount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* E-Ticket Modal */}
        {showTicketModal && selectedBooking && (
          <ETicketModal
            booking={selectedBooking}
            onClose={() => {
              setShowTicketModal(false);
              setSelectedBooking(null);
            }}
            onDownload={downloadTicket}
            ticketRef={ticketRef}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        )}
      </div>
    </section>
  );
};

// E-Ticket Modal Component
const ETicketModal = ({ booking, onClose, onDownload, ticketRef, formatDate, formatTime }) => {
  const event = booking.eventId;
  const eTicket = booking.eTicket;

  // Inline styles for html2canvas compatibility (avoids lab() color function issue)
  const styles = {
    ticketContainer: {
      background: "linear-gradient(to bottom right, #1a1a2e, #16213e)",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
    header: {
      position: "relative",
      height: "128px",
      background: "linear-gradient(to right, #ec4899, #a855f7, #6366f1)",
      padding: "16px",
    },
    headerOverlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    seatTypeBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      padding: "4px 12px",
    },
    decorativeCircle: {
      position: "absolute",
      bottom: "-16px",
      width: "32px",
      height: "32px",
      backgroundColor: "#1a1a2e",
      borderRadius: "50%",
    },
    dashedLine: {
      borderTop: "2px dashed #4b5563",
    },
    infoBox: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      padding: "12px",
    },
    pinkText: {
      color: "#f472b6",
    },
    whiteText: {
      color: "#ffffff",
    },
    grayText: {
      color: "#9ca3af",
    },
    darkGrayText: {
      color: "#6b7280",
    },
    greenText: {
      color: "#4ade80",
    },
    refBox: {
      background: "linear-gradient(to right, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))",
      borderRadius: "12px",
      padding: "12px",
      border: "1px solid rgba(236, 72, 153, 0.3)",
    },
    qrContainer: {
      backgroundColor: "#ffffff",
      padding: "12px",
      borderRadius: "16px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
    footer: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      padding: "16px 24px",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FaTimes className="text-white" />
          </button>
        </div>

        {/* E-Ticket - Using inline styles for html2canvas compatibility */}
        <div ref={ticketRef} style={styles.ticketContainer}>
          {/* Header with gradient */}
          <div style={styles.header}>
            <div style={styles.headerOverlay}></div>
            <div style={{ position: "relative", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    E-TICKET
                  </span>
                  <h2 style={{ color: "#ffffff", fontWeight: "bold", fontSize: "20px", marginTop: "4px", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {event?.title}
                  </h2>
                </div>
                <div style={styles.seatTypeBadge}>
                  <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: "600" }}>{booking.seatType}</span>
                </div>
              </div>
            </div>
            
            {/* Decorative circles */}
            <div style={{ ...styles.decorativeCircle, left: "24px" }}></div>
            <div style={{ ...styles.decorativeCircle, right: "24px" }}></div>
          </div>

          {/* Dashed line */}
          <div style={{ padding: "0 40px", marginTop: "-8px", position: "relative" }}>
            <div style={styles.dashedLine}></div>
          </div>

          {/* Event Details */}
          <div style={{ padding: "24px 24px 16px" }}>
            {/* Date & Time Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={styles.infoBox}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <FaCalendarAlt style={{ width: "12px", height: "12px", color: "#f472b6" }} />
                  <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#f472b6" }}>Date</span>
                </div>
                <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px" }}>{formatDate(event?.startDate)}</p>
              </div>
              <div style={styles.infoBox}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <FaClock style={{ width: "12px", height: "12px", color: "#f472b6" }} />
                  <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#f472b6" }}>Time</span>
                </div>
                <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px" }}>{formatTime(event?.startTime)}</p>
              </div>
            </div>

            {/* Venue */}
            <div style={{ ...styles.infoBox, marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <FaMapMarkerAlt style={{ width: "12px", height: "12px", color: "#f472b6" }} />
                <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#f472b6" }}>Venue</span>
              </div>
              <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px" }}>{event?.location?.venueName}</p>
              <p style={{ color: "#9ca3af", fontSize: "12px" }}>{event?.location?.address}, {event?.location?.city}</p>
            </div>

            {/* Ticket Details Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "12px", textTransform: "uppercase" }}>Tickets</p>
                <p style={{ color: "#ffffff", fontWeight: "bold", fontSize: "18px" }}>{booking.quantity}</p>
              </div>
              <div style={{ textAlign: "center", borderLeft: "1px solid #374151", borderRight: "1px solid #374151" }}>
                <p style={{ color: "#6b7280", fontSize: "12px", textTransform: "uppercase" }}>Type</p>
                <p style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>{booking.seatType}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "12px", textTransform: "uppercase" }}>Amount</p>
                <p style={{ color: "#4ade80", fontWeight: "bold", fontSize: "18px" }}>₹{booking.finalAmount}</p>
              </div>
            </div>

            {/* Attendee */}
            <div style={{ ...styles.infoBox, marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <FaUser style={{ width: "12px", height: "12px", color: "#f472b6" }} />
                <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#f472b6" }}>Attendee</span>
              </div>
              <p style={{ color: "#ffffff", fontWeight: "600", fontSize: "14px" }}>{booking.customerDetails?.name}</p>
              <p style={{ color: "#9ca3af", fontSize: "12px" }}>{booking.customerDetails?.email}</p>
            </div>

            {/* Booking Reference */}
            <div style={styles.refBox}>
              <p style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Booking Reference</p>
              <p style={{ color: "#ffffff", fontFamily: "monospace", fontWeight: "bold", fontSize: "18px", letterSpacing: "0.1em" }}>
                {booking.bookingReference}
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{ padding: "0 24px 24px", position: "relative" }}>
            {/* Dashed separator */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ flex: 1, borderTop: "1px dashed #4b5563" }}></div>
              <FaQrcode style={{ color: "#6b7280" }} />
              <div style={{ flex: 1, borderTop: "1px dashed #4b5563" }}></div>
            </div>

            {/* QR Code */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={styles.qrContainer}>
                <img
                  src={eTicket?.qrCodeImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingReference}`}
                  alt="Ticket QR Code"
                  style={{ width: "144px", height: "144px" }}
                  crossOrigin="anonymous"
                />
              </div>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>
                Scan this QR code at the venue entrance
              </p>
              {eTicket?.ticketNumber && (
                <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px", fontFamily: "monospace" }}>
                  {eTicket.ticketNumber}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
              Keep this ticket safe. Present it at the venue for entry.
            </p>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={onDownload}
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <FaDownload />
          Download E-Ticket
        </Button>

        {/* Instructions */}
        <div className="mt-4 bg-white/5 rounded-xl p-4 border border-gray-700/50">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
            <FaInfoCircle className="text-pink-400" />
            Instructions
          </h4>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• Arrive at least 30 minutes before the event starts</li>
            <li>• Show this QR code at the venue entrance</li>
            <li>• Carry a valid ID proof for verification</li>
            <li>• This ticket is non-transferable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;
