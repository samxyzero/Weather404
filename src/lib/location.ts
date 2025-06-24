
import { useEffect, useState } from "react";

export  function GetLocation(city?: { city: string }) {

  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    if (city) {
      setLocation(city.city);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude},${position.coords.longitude}`);
        },
        // (error) => {
        //   console.error("Geolocation error:ggggggg", error);
        // }
      );
    } else {
      setLocation("Tokyo");
     
    }
  }, [city]);

  return location;
 

}