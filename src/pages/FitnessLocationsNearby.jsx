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
    // Get the current date and time
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    const currentTime = currentDate.toTimeString().split(" ")[0];

    // Combine the date and time for comparison
    const currentDateTime = new Date(`${currentDateString}T${currentTime}`);

    // Generate a list of time slots
    const timeSlots = [
      "08:00 AM",
      "10:00 AM",
      "12:00 PM",
      "02:00 PM",
      "04:00 PM",
      "06:00 PM",
      "08:00 PM",
    ];

    const getCostFromFirestore = async (locationName) => {
      try {
        const locationsRef = collection(firestore, "fitnessLocations");
        const q = query(locationsRef, where("name", "==", locationName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
          console.error(`Document with name '${locationName}' does not exist.`);
          return null;
        }

        const locationDoc = querySnapshot.docs[0];
        const cost = locationDoc.data().cost;

        return cost;
      } catch (error) {
        console.error("Error fetching cost data:", error);
        return null;
      }
    };

    // Use SweetAlert to show the form
    const { value: formValues } = await Swal.fire({
      title: `Enroll for ${fitnessLocation.name}`,
      html: `
        <input id="swal-date" class="swal2-input enrollment-input" type="date" placeholder="Date (YYYY-MM-DD)" min="${currentDateString}">
        <br>
        <select id="swal-time-slot" class="swal2-select enrollment-input">
          <option value="">Select a time slot</option>
          ${timeSlots
            .map(
              (timeSlot) => `<option value="${timeSlot}">${timeSlot}</option>`
            )
            .join("")}
        </select>
        <br>
        <input id="swal-name" class="swal2-input enrollment-input" placeholder="Your Name">
        <br>
        <input id="swal-contact" class="swal2-input enrollment-input" placeholder="Contact Number">
        <div id="swal-cost" class="swal2-input enrollment-input">Total Cost: </div>     `,
      focusConfirm: false,
      preConfirm: async () => {
        const dateInput = document.getElementById("swal-date").value;
        const timeSlotInput = document.getElementById("swal-time-slot").value;

        // Combine the selected date and time for comparison
        const selectedDateTime = new Date(`${dateInput}T${timeSlotInput}`);

        console.log("Date Input:", dateInput);
        console.log("Time Slot Input:", timeSlotInput);

        // Date format validation (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const isDateValid = dateRegex.test(dateInput);

        if (!isDateValid) {
          Swal.showValidationMessage("Invalid date format (YYYY-MM-DD)");
        } else if (selectedDateTime < currentDateTime) {
          Swal.showValidationMessage("Date and time cannot be in the past");
        } else if (timeSlotInput === "") {
          Swal.showValidationMessage("Please select a time slot");
        } else {
          // Calculate the cost based on the selected fitness location
          const cost = await getCostFromFirestore(fitnessLocation.name);

          if (cost !== null && !isNaN(cost)) {
            // Display the calculated cost
            const costElement = document.getElementById("swal-cost");
            console.log("costElement:", costElement); // Add this line for debugging

            costElement.textContent = `Total Cost: $${(
              parseFloat(cost) * 2
            ).toFixed(2)}`;
            console.log("Cost Value:", costElement.textContent); // Add this line for debugging

            return [
              dateInput,
              timeSlotInput,
              document.getElementById("swal-name").value,
              document.getElementById("swal-contact").value,
              parseFloat(cost), // Include the cost in the formValues
            ];
          } else {
            Swal.showValidationMessage("Error fetching cost data");
          }
        }
      },
    });

    if (formValues) {
      // Ensure formValues is structured as an array
      if (Array.isArray(formValues)) {
        const [date, timeSlot, name, contact, cost] = formValues;

        // Save the enrollment information to Firestore
        const enrollmentData = {
          date,
          timeSlot,
          name,
          contact,
          fitnessLocation: fitnessLocation.name,
          status: "pending",
          userId: currentUser,
          totalCost: parseFloat(cost) * 2, // Parse the cost as a float
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
