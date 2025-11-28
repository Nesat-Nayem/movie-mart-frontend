"use client";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { FaArrowLeft } from "react-icons/fa";

const EventTicket = () => {
  const router = useRouter();
  return (
    <section className="py-10">
      <div className="max-w-sm mx-auto shadow-2xl border border-gray-700 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="p-2 rounded-full bg-white/10 cursor-pointer"
            onClick={() => router.push("/profile-settings")}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-lg font-semibold">E-Ticket</h1>
        </div>

        {/* Instruction */}
        <div className="mb-6">
          <h2 className="font-semibold text-base mb-2">Instruction</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Come to the cinema, show and scan the barcode to the space provided.
            Continue to comply with health protocols.
          </p>
        </div>

        {/* Ticket */}
        <div className="bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Film: Shang-Chi</h3>
              <span className="text-pink-600 font-semibold">e-ticket</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-yellow-500 font-medium">Date</p>
                <p>06/09/2021</p>
              </div>
              <div>
                <p className="text-yellow-500 font-medium">Seats</p>
                <p>c4, c5</p>
              </div>
              <div>
                <p className="text-yellow-500 font-medium">Location</p>
                <p>Viva Cinema</p>
              </div>
              <div>
                <p className="text-yellow-500 font-medium">Time</p>
                <p>01.00 PM</p>
              </div>
              <div>
                <p className="text-yellow-500 font-medium">Payment</p>
                <p>Successful</p>
              </div>
              <div>
                <p className="text-yellow-500 font-medium">Order</p>
                <p>1904566</p>
              </div>
            </div>
          </div>

          {/* Barcode */}
          <div className="border-t border-dashed border-gray-400 relative">
            <div className="absolute -top-3 left-0 w-6 h-6 bg-gradient-to-b  rounded-full"></div>
            <div className="absolute -top-3 right-0 w-6 h-6 bg-gradient-to-b  rounded-full"></div>
            <div className="flex justify-center items-center py-6">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket"
                alt="Barcode"
                className="h-16"
              />
            </div>
          </div>
        </div>

        {/* Button */}

        <Button className="w-full mt-6" onClick={() => router.push("/login")}>
          {" "}
          Download E-Ticket
        </Button>
      </div>
    </section>
  );
};

export default EventTicket;
