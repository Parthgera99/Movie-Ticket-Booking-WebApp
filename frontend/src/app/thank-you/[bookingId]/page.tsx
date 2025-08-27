// // app/thank-you/[bookingId]/page.tsx (Next.js 13+ with app router)
// // or pages/thank-you/[bookingId].tsx if you're using pages router

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "@/lib/axios";

// interface Booking {
//   bookingId: string;
//   seats: string[];
//   totalPrice: number;
//   reference: string;
// }

// export default function ThankYouPage() {
//   const { bookingId } = useParams();
//   const [booking, setBooking] = useState<Booking | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const res = await axios.get(`/booking/${bookingId}`);
//         setBooking(res.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load booking details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookingId) fetchBooking();
//   }, [bookingId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg">
//         Loading your booking...
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         Booking not found
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
//       <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
//         <h1 className="text-2xl font-bold text-green-600 mb-4">
//           ✅ Booking Confirmed!
//         </h1>

//         <p className="text-gray-700 mb-6">
//           Thank you for your booking. Here are your details:
//         </p>

//         <div className="text-left space-y-3">
//           <p>
//             <span className="font-semibold">Booking ID:</span>{" "}
//             {booking.bookingId}
//           </p>
//           <p>
//             <span className="font-semibold">Seats:</span>{" "}
//             {booking.seats.join(", ")}
//           </p>
//           <p>
//             <span className="font-semibold">Total Price:</span> ₹
//             {booking.totalPrice}
//           </p>
//           <p>
//             <span className="font-semibold">Reference:</span>{" "}
//             {booking.reference}
//           </p>
//         </div>

//         <button
//           onClick={() => (window.location.href = "/")}
//           className="mt-8 px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }




// app/thank-you/[bookingId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";

interface BookingResponse {
  _id: string;
  status: string;
  seats: string[];
  totalPrice: number;
  createdAt: string;
  show: {
    movie: {
      title: string;
      posterUrl: string;
      genre: string[];
      rating: number;
      duration: number;
      language: string[];
    };
    screen: {
      name: string;
      cinema: {
        name: string;
        address: { street: string; area: string; city: string };
      };
    };
    startTime: string;
    endTime: string;
    price: number;
  };
}

export default function ThankYouPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/booking/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Booking not found.
      </div>
    );
  }

  const { movie, screen, startTime, endTime } = booking.show;
  const cinema = screen.cinema;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
          🎉 Booking Confirmed!
        </h1>

        {/* Movie Section */}
        <div className="flex gap-4 mb-6">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-32 h-48 rounded-lg object-cover shadow"
          />
          <div>
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-gray-600 text-sm">
              {movie.genre.join(", ")} • {movie.duration} mins
            </p>
            <p className="text-gray-600 text-sm">
              Languages: {movie.language.join(", ")}
            </p>
            <p className="text-yellow-500 font-medium">⭐ {movie.rating}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Booking ID:</span> {booking._id}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="text-green-600">{booking.status}</span>
          </p>
          <p>
            <span className="font-semibold">Cinema:</span> {cinema.name},{" "}
            {cinema.address.area}, {cinema.address.city}
          </p>
          <p>
            <span className="font-semibold">Screen:</span> {screen.name}
          </p>
          <p>
            <span className="font-semibold">Show Timings:</span>{" "}
            {new Date(startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <span className="font-semibold">Seats:</span>{" "}
            {booking.seats.join(", ")}
          </p>
          <p className="text-lg font-semibold">
            Total: ₹{booking.totalPrice}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
