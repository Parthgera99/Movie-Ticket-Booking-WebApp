// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useCity } from "@/context/CityContext";
// import { useAuth } from "@/context/AuthContext";
// import axios from "@/lib/axios";
// import { Button } from "@/components/ui/button";

// type Show = {
//   _id: string;
//   movie: string;      // movie ID
//   screen: string;     // screen ID
//   startTime: string;
//   endTime: string;
//   price: number;
//   bookedSeats: string[];
// };

// type Screen = {
//   _id: string;
//   name: string;
//   seatLayout: {
//     rows: number;
//     cols: number;
//   };
//   shows: Show[];
// };

// type Cinema = {
//   _id: string;
//   name: string;
//   address: {
//     city: string;
//     area?: string;
//     street?: string;
//   };
//   location: {
//     type: string;
//     coordinates: number[];
//   };
//   screens: Screen[];
// };


// export default function BookTicketsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { city } = useCity();
//   const { user } = useAuth();

//   const [cinemas, setCinemas] = useState<Cinema[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedShow, setSelectedShow] = useState<Show | null>(null);

//   // Fetch cinemas showing this movie
//   useEffect(() => {
//     console.log("City value:", city);
//     if (!city) return;

//     const fetchCinemas = async () => {
//       setLoading(true);

//       try {
//         console.log(city, params.id)
//         const res = await axios.get(`/cinema/list`, {
//           params: { city, movieId: params.id }, // backend filters by city & movie
//         });
//         console.log(res)
//         setCinemas(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCinemas();
//   }, [city, params.id]);

//   const handleSelectShow = (show: Show) => {
//     setSelectedShow(show);
//   };

//   const handleBook = () => {
//     if (!selectedShow || !user) {
//       alert("Please select a show and login first");
//       return;
//     }
//     router.push(`/checkout/${selectedShow._id}`); // or your booking flow
//   };

//   if (!user) return <p className="text-center mt-10">Please login to book tickets</p>;
//   if (!city) return <p className="text-center mt-10">Detect your city to see available cinemas</p>;
//   if (loading) return <p className="text-center mt-10">Loading cinemas...</p>;

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <h1 className="text-3xl font-bold text-red-600 mb-6">Select Cinema & Show</h1>

//       {cinemas.length === 0 ? (
//         <p className="text-center text-gray-600">No cinemas found in {city} showing this movie.</p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {cinemas.map((cinema) => (
//             <div key={cinema._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
//               <h2 className="text-xl font-semibold">{cinema.name}</h2>
//               <p className="text-gray-500">{cinema.address.city}</p>

//               <div className="flex flex-wrap gap-2 mt-2">
//                 {cinema.screens.map(screen => (
//                 <div key={screen._id}>
//                     <h3>{screen.name}</h3>
//                     {screen.shows.map(show => (
//                     <Button key={show._id} onClick={() => handleSelectShow(show)}>
//                         {new Date(show.startTime).toLocaleString()}
//                     </Button>
//                     ))}
//                 </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedShow && (
//         <div className="mt-6 flex justify-end">
//           <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleBook}>
//             Book Now
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }











"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";

type Show = {
  _id: string;
  movie: string;
  screen: string;
  startTime: string;
  endTime: string;
  price: number;
  bookedSeats: string[];
};

type Screen = {
  _id: string;
  name: string;
  seatLayout: { rows: number; cols: number };
  shows: Show[];
};

type Cinema = {
  _id: string;
  name: string;
  address: { city: string; area?: string; street?: string };
  location: { type: string; coordinates: number[] };
  screens: Screen[];
};

type Movie = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  language?: string[];
  posterUrl?: string;
  genre?: string[];
  rating?: number;
};

export default function BookTicketsPage() {
  const params = useParams(); // expects { id } from /book/[id]
  const router = useRouter();
  const { city } = useCity();
  const { user } = useAuth();

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);

  // Fetch cinemas showing this movie in user's city
  useEffect(() => {
    if (!city) return;

    const fetchCinemas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/cinema/list`, {
          params: { city, movieId: params.id },
        });
        setCinemas(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [city, params.id]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/movie/${params.id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  const isPast = (iso: string) => new Date(iso).getTime() < Date.now();

  const onShowClick = (showId: string) => {
    if (!user) {
      // preserve intent: send them to login then back to the seat page
      router.push(`/login?next=/seats/${showId}`);
      return;
    }
    router.push(`/seats/${showId}`);
  };

  if (!city) return <p className="text-center mt-10">Detect your city to see available cinemas</p>;
  if (loading) return <p className="text-center mt-10">Loading cinemas...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Select a Show for <p className="text-black inline">{movie?.title}</p></h1>

      {cinemas.length === 0 ? (
        <p className="text-center text-gray-600">
          No cinemas found in {city} showing this movie.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {cinemas.map((cinema) => (
            <div
              key={cinema._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{cinema.name}</h2>
                  <p className="text-gray-500">
                    {cinema.address.city}
                    {cinema.address.area ? ` • ${cinema.address.area}` : ""}
                    {cinema.address.street ? ` • ${cinema.address.street}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {cinema.screens.map((screen) => (
                  <div key={screen._id}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {screen.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {screen.shows.map((show) => {
                        const disabled = isPast(show.startTime);
                        return (
                          <Button
                            key={show._id}
                            size="sm"
                            variant="outline"
                            disabled={disabled}
                            onClick={() => onShowClick(show._id)}
                            className="cursor-pointer"
                            title={disabled ? "Show time has passed" : "Select seats"}
                          >
                            {new Date(show.startTime).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
