// "use client";
// import { Button } from "@/components/ui/button";
// import { useCity } from "@/context/CityContext";
// import { useState } from "react";
// import axios from "@/lib/axios";
// import Link from "next/link";

// export default function Navbar() {
//   const { city, setCity } = useCity();
//   const [loading, setLoading] = useState(false);

//   const detectLocation = () => {
//   if (!navigator.geolocation) return alert("Geolocation not supported");
//   setLoading(true);

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       try {
//         const { latitude, longitude } = position.coords;
//         console.log(latitude, longitude);
//         // Call your Next.js API route
//         const res = await axios.get("http://localhost:3000/api/getCity", {
//   params: { lat: latitude, lng: longitude },
// });



//         if (res.data.city) setCity(res.data.city);
//         else alert("City not found");
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch city from API");
//       } finally {
//         setLoading(false);
//       }
//     },
//     (err) => {
//       console.error(err);
//       alert("Failed to get location");
//       setLoading(false);
//     }
//   );
// };


//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
//         <h1 className="text-2xl font-bold text-red-600">MovieTicketHub</h1>

//         <div className="flex gap-4 items-center">
//           {/* City Display & Detect */}
//           <div className="flex gap-2 items-center">
//             <span>{city ? "Current Location:" : "Select City"}</span>
//             <Button className="cursor-pointer" size="sm" onClick={detectLocation} disabled={loading}>
//               {loading ? "Detecting..." : city || "Detect My Location"}
//             </Button>
//           </div>

//           <Link href="/login">
//             <Button variant="outline">Login</Button>
//           </Link>
//           <Link href="/register">
//             <Button className="bg-red-600 hover:bg-red-700 text-white">Register</Button>
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }




"use client";
import { Button } from "@/components/ui/button";
import { useCity } from "@/context/CityContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";

export default function Navbar() {
  const { city, setCity } = useCity();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get("http://localhost:3000/api/getCity", {
            params: { lat: latitude, lng: longitude },
          });

          if (res.data.city) setCity(res.data.city);
          else alert("City not found");
        } catch (err) {
          console.error(err);
          alert("Failed to fetch city from API");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Failed to get location");
        setLoading(false);
      }
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <Link href="/">
          <h1 className="text-2xl font-bold text-red-600">MovieTicketHub</h1>
        </Link>

        <div className="flex gap-4 items-center">
          {/* City Display & Detect */}
          <div className="flex gap-2 items-center">
            <span>{city ? "Current Location:" : "Select City"}</span>
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={detectLocation}
              //disabled={loading || !!city} // disable if city already detected
            >
              {loading ? "Detecting..." : city || "Detect My Location"}
            </Button>
          </div>

          {/* Auth Buttons / User Info */}
          {user ? (
            <div className="flex gap-4 items-center">
              <span className="font-medium">{user.name} {user.role==="admin"?"(Admin)":""}</span>
              <Button
                onClick={logout}
                variant="outline"
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button className="cursor-pointer" variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
