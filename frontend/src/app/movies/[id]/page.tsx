"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { FastAverageColor } from "fast-average-color";

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

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [bgGradient, setBgGradient] = useState<string>("bg-gray-50");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

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

  useEffect(() => {
    if (!movie?.posterUrl) return;

    const fac = new FastAverageColor();
    fac
      .getColorAsync(movie.posterUrl)
      .then((color) => {
        // Create a gradient using the main color
        setBgGradient(
          `linear-gradient(to bottom, ${color.hex} 0%, #000000 100%)`
        );
      })
      .catch((err) => console.error(err));
  }, [movie?.posterUrl]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!movie) return <p className="text-center mt-10">Movie not found.</p>;

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ background: bgGradient }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <img
          ref={imgRef}
          src={movie.posterUrl || "/file.svg"}
          alt={movie.title}
          className="w-full md:w-1/3 h-auto rounded-xl shadow-lg object-cover"
        />

        {/* Movie Info */}
        <div className="flex-1 flex flex-col gap-4 text-white">
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          {movie.genre && (
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="bg-white/20 px-3 py-1 rounded-full text-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {movie.rating !== undefined && (
            <p className="text-yellow-300 font-semibold">⭐ {movie.rating}/10</p>
          )}

          <p>{movie.description}</p>

          <div className="flex gap-4 mt-4 text-white/90">
            <p>
              <strong>Duration:</strong> {formatDuration(movie.duration)}
            </p>
            {movie.language && (
              <p>
                <strong>Language:</strong> {movie.language.join(", ")}
              </p>
            )}
          </div>

          <Button
            className="cursor-pointer mt-6 bg-red-600 hover:bg-red-700 text-white w-48"
            onClick={() => router.push(`/book/${movie._id}`)}
          >
            Book Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}
