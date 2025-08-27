"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Navbar from "@/components/Navbar";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Movie = { _id: string; title: string; posterUrl: string; genre?: [string]; };

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { city } = useCity();
  const { user } = useAuth();

  useEffect(() => {
    axios.get("/movie").then((res) => setMovies(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Latest Movies</h2>
        {user && <p className="text-lg">Welcome, {user.name}!</p>}
        <p className="text-lg">Book tickets in {city || "your city"} now!</p>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {movies.length === 0 ? (
          <p className="text-center text-gray-600">No movies available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <Link
                key={movie._id}
                href={`/movies/${movie._id}`}
                className="group transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={movie.posterUrl || "/file.svg"}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded-xl"
                />
                <p className="text-center mt-1 font-medium">{movie.title}</p>
                {movie.genre && movie.genre.length > 0 && (
                  <p className="text-center text-sm text-gray-500">
                    {movie.genre.slice(0, 3).join(" / ")}
                  </p>
                )}
              </Link>

            ))}
          </div>
        )}
      </main>
    </div>
  );
}
