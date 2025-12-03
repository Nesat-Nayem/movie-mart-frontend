import { Suspense } from "react";
import EventTicket from "./EventTicket";

export const metadata = {
  title: "My Event Tickets | MovieMart",
  description: "View and download your event tickets. Access your e-tickets with QR codes for easy venue entry.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading tickets...</p>
      </div>
    </div>
  );
}

const EventTicketPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EventTicket />
    </Suspense>
  );
};

export default EventTicketPage;
