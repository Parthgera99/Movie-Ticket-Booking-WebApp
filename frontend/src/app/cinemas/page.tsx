// app/cinemas/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";

interface Cinema {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    api.get("/cinema/list").then((res) => setCinemas(res.data));
  }, []);

  return (
    <div className="grid gap-4 p-4">
      {cinemas.map((c) => (
        <Card key={c._id}>
          <CardContent>
            <h2 className="text-lg font-bold">{c.name}</h2>
            {/* <p>{c.location}</p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
