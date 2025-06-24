
import { useEffect, useState, useCallback } from "react";

type Location = string | null;

export function useUserLocation(initialCity?: string) {
  const [location, setLocation] = useState<Location>(initialCity ?? null);

  // Expose a setter so parent components can override location
  const updateLocation = useCallback((newLoc: string) => {
    setLocation(newLoc);
  }, []);

  useEffect(() => {
    // If initial prop is provided, use it
    if (initialCity) {
      setLocation(initialCity);
      return;
    }

    // Otherwise try geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setLocation(coords);
        },
        (err) => {
          console.warn("Geolocation failed:", err);
          setLocation("Tokyo"); // fallback
        }
      );
    } else {
      setLocation("Tokyo"); 
    }
  }, [initialCity]);

  return { location, setLocation: updateLocation };
}


// import { useEffect, useState } from "react";

// export  function useGetLocation(city?: { city: string }) {

//   const [location, setLocation] = useState<string | null>(null);

//   useEffect(() => {
//     if (city) {
//       setLocation(city.city);
//     } else if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation(`${position.coords.latitude},${position.coords.longitude}`);
//         },
//       );
//     } else {
//       setLocation("Tokyo");
     
//     }
//   }, [city]);

//   return location;
 

// }