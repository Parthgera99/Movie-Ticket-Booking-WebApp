"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

type ShowDto = {
  _id: string;
  movie: {
    _id: string;
    title: string;
  };
  screen: {
    _id: string;
    name: string;
    seatLayout: { rows: number; cols: number };
  };
  startTime: string;
  endTime: string;
  price: number;
  bookedSeats: string[];
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ matches /checkout/[showId]

  const seats = searchParams.get("seats")?.split(",") || [];

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState<ShowDto | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      if (!params.showId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/show/details/${params.showId}`);
        setShow(res.data);
      } catch (e) {
        console.error("Error fetching show:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [params.showId]);

  const handlePayNow = async () => {
  if (!show) return;
  setLoading(true);

  try {
    const res = await axios.post(`/booking/${show._id}/book`, { seats });

    const data = res.data;

    router.push(`/thank-you/${data.bookingId}`);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  if (loading && !show) {
    return <p className="text-center mt-10">Loading checkout...</p>;
  }

  if (!show) {
    return <p className="text-center mt-10">Show not found.</p>;
  }

  const total = seats.length * show.price;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Movie:</span>
            <span>{show.movie.title}</span> {/* ✅ from backend */}
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Seats:</span>
            <span>{seats.join(", ")}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Show Timings:</span>
            <span>
              {new Date(show.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              {" - "}
              {new Date(show.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Price per Seat:</span>
            <span>₹{show.price}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePayNow}
          disabled={loading}
          className="cursor-pointer w-full mt-6 bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
