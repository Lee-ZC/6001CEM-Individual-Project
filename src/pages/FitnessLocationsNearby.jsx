import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Nav from "../components/Nav";
import { firestore } from "../firebase";
import Swal from "sweetalert2"; // Import SweetAlert
import "./css/FitnessLocationsNearby.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Import your Firebase configuration

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
  const [filterCategory, setFilterCategory] = useState("All");
  const [isMounted, setIsMounted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // To store the current user's ID

  useEffect(() => {
    // Initialize Firebase Authentication and listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid); // Set the current user's ID
      } else {
        setCurrentUser(null); // No user is signed in.
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (isMounted) {
          setUserLocation({ latitude, longitude });
          console.log("User Location:", latitude, longitude);
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
  }, [userLocation, isMounted, filterCategory]);

  const getNearbyFitnessLocations = async () => {
    try {
      const fitnessLocationsRef = collection(firestore, "fitnessLocations");
      const q = query(
        fitnessLocationsRef,
        filterCategory === "All"
          ? where("category", "in", [
              "Outdoor Activities",
              "Group Fitness Classes",
            ])
          : where("category", "==", filterCategory)
      );

      const querySnapshot = await getDocs(q);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error querying Firestore:", error);
    }
  };

  const openEnrollmentForm = async (fitnessLocation) => {
    // Use SweetAlert to show the form
    const { value: formValues } = await Swal.fire({
      title: `Enroll for ${fitnessLocation.name}`,
      html:
        '<input id="swal-date" class="swal2-input" placeholder="Date">' +
        '<input id="swal-time" class="swal2-input" placeholder="Time">' +
        '<input id="swal-name" class="swal2-input" placeholder="Your Name">' +
        '<input id="swal-contact" class="swal2-input" placeholder="Contact Number">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-date").value,
          document.getElementById("swal-time").value,
          document.getElementById("swal-name").value,
          document.getElementById("swal-contact").value,
        ];
      },
    });

    if (formValues) {
      // Save the enrollment information to Firestore
      const [date, time, name, contact] = formValues;
      const enrollmentData = {
        date,
        time,
        name,
        contact,
        fitnessLocation: fitnessLocation.name,
        userId: currentUser, // Save the current user's ID
      };

      try {
        const docRef = await addDoc(
          collection(firestore, "enrollments"),
          enrollmentData
        );
        console.log("Enrollment successfully added with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding enrollment: ", error);
      }
    }
  };

  return (
    <div>
      <Nav />
      <div className="fitness-locations-container">
        <h2>Fitness Locations Nearby</h2>

        <div className="filter-container">
          <label>Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Outdoor Activities">Outdoor Activities</option>
            <option value="Group Fitness Classes">Group Fitness Classes</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <ul className="fitness-locations-list">
            {nearbyLocations.map(({ fitnessLocation, distance }, index) => (
              <li key={index}>
                <button onClick={() => openEnrollmentForm(fitnessLocation)}>
                  Enroll
                </button>
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
    </div>
  );
}

export default FitnessLocationsNearby;
