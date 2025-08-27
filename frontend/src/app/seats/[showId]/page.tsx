"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

type ShowDto = {
  _id: string;
  movie: {
    _id: string;
    title: string;   // <- add this (and whatever else you return in movie)
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

export default function SeatSelectionPage() {
  const { user } = useAuth();
  const params = useParams(); // { showId }
  const router = useRouter();
  const [show, setShow] = useState<ShowDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      setLoading(true);
      try {
        // expects: GET /show/:id -> returns show with populated screen (seatLayout) and bookedSeats
        const res = await axios.get(`/show/details/${params.showId}`);
        setShow(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [params.showId]);

  useEffect(() => {
    if (!user) {
      // if they somehow reached here logged out, send them to login and back
      router.replace(`/login?next=/seats/${params.showId}`);
    }
  }, [user, params.showId, router]);

  const seatIds = useMemo(() => {
    if (!show) return [];
    const rows = show.screen.seatLayout.rows;
    const cols = show.screen.seatLayout.cols;

    const ids: string[] = [];
    for (let r = 0; r < rows; r++) {
      const rowChar = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 1; c <= cols; c++) {
        ids.push(`${rowChar}${c}`);
      }
    }
    return ids;
  }, [show]);

  const toggleSeat = (id: string) => {
    if (!show) return;
    if (show.bookedSeats.includes(id)) return; // already booked

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const proceed = async () => {
    if (!show) return;
    if (selected.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Option A: Navigate to checkout page with query
    // router.push(`/checkout?showId=${show._id}&seats=${selected.join(",")}`);

    // Option B: Directly create a booking then navigate (example)
    // await axios.post("/booking", { showId: show._id, seats: selected });
    // router.push(`/booking/confirm/<id>`);

    router.push(`/checkout/${show._id}?seats=${selected.join(",")}`);
  };

  if (loading) return <p className="text-center mt-10">Loading show & seats...</p>;
  if (!show) return <p className="text-center mt-10">Show not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Select Seats • {show.movie.title} </h1>
        <p className="text-gray-600">
          {show.screen.name} • {new Date(show.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
        </p>
        <p className="text-gray-600">Price: ₹{show.price} per seat</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="mb-4 text-center text-gray-500">Screen This Way</div>

        {/* Seat Grid */}
        <div
          className="grid gap-2 justify-center"
          style={{
            gridTemplateColumns: `repeat(${show.screen.seatLayout.cols}, minmax(32px, 40px))`,
          }}
        >
          {seatIds.map((seat) => {
            const booked = show.bookedSeats.includes(seat);
            const active = selected.includes(seat);
            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                disabled={booked}
                className={[
                  "cursor-pointer h-10 min-w-10 rounded-md border text-sm",
                  booked
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : active
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white hover:bg-gray-50",
                ].join(" ")}
                title={booked ? "Already booked" : "Available"}
              >
                {seat}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-6 justify-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded border bg-white" />
            Available
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded border bg-gray-300" />
            Booked
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded border bg-red-600" />
            Selected
          </div>
        </div>

        {/* Footer: Total & Proceed */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-lg">
            <span className="font-medium">Selected:</span>{" "}
            {selected.length > 0 ? selected.join(", ") : "None"}
            {selected.length > 0 && (
              <span className="ml-3 text-gray-600">
                • Total: ₹{selected.length * show.price}
              </span>
            )}
          </div>

          <Button
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            onClick={proceed}
            disabled={selected.length === 0 || posting}
          >
            {posting ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
