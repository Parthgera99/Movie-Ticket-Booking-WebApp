import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${process.env.OPENCAGE_KEY}`
    );

    const components = response.data.results[0]?.components;
    const cityName = components?.city || components?.town || components?.village;

    return NextResponse.json({ city: cityName || null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch city" }, { status: 500 });
  }
}
