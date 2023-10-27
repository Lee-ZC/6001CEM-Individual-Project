import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Nav from "../components/Nav";
import { firestore } from "../firebase";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515; // Distance in miles
  dist = dist * 1.609344; // Distance in kilometers
  return dist * 1000; // Distance in meters
}

function FitnessLocationsNearby() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (isMounted) {
          setUserLocation({ latitude, longitude });
        }
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      getNearbyFitnessLocations();
    }
  }, [userLocation, isMounted]);

  const getNearbyFitnessLocations = async () => {
    try {
      const fitnessLocationsRef = collection(firestore, "fitnessLocations");
      const querySnapshot = await getDocs(fitnessLocationsRef);
      const locations = [];

      querySnapshot.forEach((doc) => {
        const fitnessLocation = doc.data();
        const location = {
          latitude: fitnessLocation.latitude,
          longitude: fitnessLocation.longitude,
        };

        if (userLocation && location) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            location.latitude,
            location.longitude
          );

          if (distance <= 5000) {
            locations.push({ fitnessLocation, distance });
          }
        }
      });

      if (isMounted) {
        setNearbyLocations(locations);
        setIsLoading(false); // Set loading to false once data is fetched
      }
    } catch (error) {
      console.error("Error querying Firestore:", error);
    }
  };

  return (
    <div>
      <Nav />
      <h2>Fitness Locations Nearby</h2>
      {isLoading ? (
        // Display loading indicator while data is being fetched
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      ) : (
        // Display the list of nearby locations when data is available
        <ul>
          {nearbyLocations.map(({ fitnessLocation, distance }, index) => (
            <li key={index}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${fitnessLocation.latitude},${fitnessLocation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fitnessLocation.name}
              </a>{" "}
              - {fitnessLocation.address} (Distance: {distance} meters)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FitnessLocationsNearby;
