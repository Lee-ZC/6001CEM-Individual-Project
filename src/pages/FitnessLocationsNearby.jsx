import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Nav from "../components/Nav";
import { firestore } from "../firebase";
import Swal from "sweetalert2"; // Import SweetAlert
import "./css/FitnessLocationsNearby.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Import your Firebase configuration
import "./css/FitnessLocationsNearby.css"; // Import your custom CSS

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
      unsubscribe();
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

  const openEnrollmentForm = async (fitnessLocation) => {
    // Use SweetAlert to show the form
    const { value: formValues } = await Swal.fire({
      title: `Enroll for ${fitnessLocation.name}`,
      html:
        '<input id="swal-date" class="swal2-input enrollment-input" type="date" placeholder="Date (YYYY-MM-DD)">' +
        "<br>" +
        '<input id="swal-start-time" class="swal2-input enrollment-input" type="time" placeholder="Start Time (HH:MM AM/PM)">' +
        "<br>" +
        '<input id="swal-end-time" class="swal2-input enrollment-input" type="time" placeholder="End Time (HH:MM AM/PM)">' +
        "<br>" +
        '<input id="swal-name" class="swal2-input enrollment-input" placeholder="Your Name">' +
        "<br>" +
        '<input id="swal-contact" class="swal2-input enrollment-input" placeholder="Contact Number">',
      focusConfirm: false,
      preConfirm: () => {
        const dateInput = document.getElementById("swal-date").value;
        const startTimeInput = document.getElementById("swal-start-time").value;
        const endTimeInput = document.getElementById("swal-end-time").value;

        console.log("Date Input:", dateInput);
        console.log("Start Time Input:", startTimeInput);
        console.log("End Time Input:", endTimeInput);

        // Date format validation (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const isDateValid = dateRegex.test(dateInput);

        // Time format validation (HH:MM AM/PM)
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        const isStartTimeValid = timeRegex.test(startTimeInput);
        const isEndTimeValid = timeRegex.test(endTimeInput);

        if (!isDateValid) {
          Swal.showValidationMessage("Invalid date format (YYYY-MM-DD)");
        } else if (!isStartTimeValid || !isEndTimeValid) {
          Swal.showValidationMessage("Invalid time format (HH:MM AM/PM)");
        } else {
          return [
            dateInput,
            startTimeInput,
            endTimeInput,
            document.getElementById("swal-name").value,
            document.getElementById("swal-contact").value,
          ];
        }
      },
    });

    if (formValues) {
      const [date, startTime, endTime, name, contact] = formValues;

      // Calculate the total time duration in hours
      const start = new Date(`${date} ${startTime}`);
      const end = new Date(`${date} ${endTime}`);
      const totalTimeHours = ((end - start) / 3600000).toFixed(2); // 3600000 milliseconds in an hour

      // Save the enrollment information to Firestore
      const enrollmentData = {
        date,
        startTime,
        endTime,
        totalTime: totalTimeHours,
        name,
        contact,
        fitnessLocation: fitnessLocation.name,
        status: "pending",
        userId: currentUser,
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
      <div className="enroll-page-container">
        <h2 className="enroll-page-title">Fitness Locations Nearby</h2>

        <div className="filter-container">
          <label className="enroll-page-label">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="enroll-page-select"
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
            {nearbyLocations.map(({ fitnessLocation, distance }, index) => {
              const distanceDisplay =
                distance < 1000
                  ? `${distance.toFixed(2)} meters`
                  : `${(distance / 1000).toFixed(2)} km`;

              return (
                <li key={index} className="fitness-location-item">
                  <button
                    onClick={() => openEnrollmentForm(fitnessLocation)}
                    className="enroll-button"
                  >
                    Enroll
                  </button>
                  {"   "}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${fitnessLocation.latitude},${fitnessLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fitness-location-link"
                  >
                    {fitnessLocation.name}
                  </a>{" "}
                  - {fitnessLocation.address} (Distance: {distanceDisplay})
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FitnessLocationsNearby;
