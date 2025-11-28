import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const BookTicketDrawer = ({ event, onClose }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(2);
  const [personType, setPersonType] = useState("VIP");

  useEffect(() => {
    if (event) {
      setTimeout(() => setIsVisible(true), 10);
    }
  }, [event]);

  if (!event) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // match transition duration
  };

  const [selectedType, setSelectedType] = useState("VIP");

  const seatTypes = [
    { type: "Normal", price: 250 },
    { type: "VIP", price: 480 },
    { type: "VVIP", price: 1040 },
  ];
  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-1/2 md:w-1/3 
                bg-[#0a0a29] rounded-l-2xl shadow-lg z-50 
                   transform transition-transform duration-300
                   ${isVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">How many seats?</h2>
          <button
            onClick={handleClose}
            className="text-gray-500  cursor-pointer bg-white/10 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Type of Person */}
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Type of Person{" "}
              <span className="text-gray-400">(Normal / VIP / VVIP)</span>
            </label>
            <select
              value={personType}
              onChange={(e) => setPersonType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-gray-700 focus:ring-pink-500"
            >
              <option value="Normal">Normal</option>
              <option value="VIP">VIP</option>
              <option value="VVIP">VVIP</option>
            </select>
          </div>

          {/* Seat Count */}
          <div className="flex justify-center gap-3">
            {[...Array(10)].map((_, i) => {
              const seat = i + 1;
              return (
                <button
                  key={seat}
                  onClick={() => setSelectedSeats(seat)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium transition cursor-pointer ${
                    selectedSeats === seat
                      ? "bg-pink-600 text-white"
                      : " hover:bg-black"
                  }`}
                >
                  {seat}
                </button>
              );
            })}
          </div>

          {/* Seat Types */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            {seatTypes.map((seat) => (
              <div
                key={seat.type}
                onClick={() => setSelectedType(seat.type)}
                className={`p-3 border rounded-lg cursor-pointer transition 
            ${
              selectedType === seat.type
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white/10  "
            }`}
              >
                <p className="font-semibold">{seat.type}</p>
                <p>₹{seat.price}</p>
              </div>
            ))}
          </div>

          {/* Bestseller Note */}
          <p className="text-xs text-gray-500 text-center">
            Book the{" "}
            <span className="bg-yellow-200 px-1">Bestseller Seats</span> in this
            cinema at no extra cost!
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            className="w-full bg-pink-600 hover:bg-pink-700"
            onClick={() => router.push(`/events/checkout`)}
          >
            Select Seats
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookTicketDrawer;
