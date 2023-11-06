import React, { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import Nav from "../components/Nav";
import { firestore } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./css/EnrollmentsHistory.css"; // Import your custom CSS

function EnrollmentsHistory() {
  const [enrollments, setEnrollments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(""); // State to store the selected date

  useEffect(() => {
    // Fetch the current user's ID
    getCurrentUserId()
      .then((userId) => {
        setCurrentUser(userId);

        if (userId) {
          // Fetch enrollments from Firestore
          fetchEnrollments(userId, selectedDate);
        }
      })
      .catch((error) => {
        console.error("Error getting user ID: ", error);
        setIsLoading(false);
      });
  }, [selectedDate]);

  const fetchEnrollments = async (userId, date) => {
    const enrollmentsRef = collection(firestore, "enrollments");
    let q = query(enrollmentsRef, where("userId", "==", userId));

    if (date) {
      q = query(
        enrollmentsRef,
        where("userId", "==", userId),
        where("date", "==", date)
      );
    }

    try {
      const querySnapshot = await getDocs(q);
      const enrollmentData = [];

      querySnapshot.forEach((doc) => {
        enrollmentData.push(doc.data());
      });

      setEnrollments(enrollmentData);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getCurrentUserId() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.uid); // Return the user's ID if authenticated
        } else {
          resolve(null); // Return null if the user is not authenticated
        }
      });
    });
  }

  return (
    <div>
      <Nav />
      <br />
      <div className="enrollments-history-container">
        <h2 className="history-title">Enrollments History</h2>

        <div>
          <label htmlFor="dateFilter">Filter by Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <br />

        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <ul className="enrollments-list">
            {enrollments.map((enrollment, index) => (
              <li key={index} className="enrollment-item">
                <strong className="enrollment-label">Date:</strong>
                {enrollment.date} <br />
                <strong className="enrollment-label">Time Slot:</strong>
                {enrollment.timeSlot} <br />
                <strong className="enrollment-label">Total Time:</strong>
                {enrollment.totalTime} 2 hours
                <br />
                <strong className="enrollment-label">Total Cost:</strong> {"RM"}
                {enrollment.totalCost}
                <br />
                <strong className="enrollment-label">Name:</strong>
                {enrollment.name} <br />
                <strong className="enrollment-label">Contact:</strong>
                {enrollment.contact} <br />
                <strong className="enrollment-label">Fitness Name:</strong>
                {enrollment.fitnessLocation} <br /> <br />
                <strong
                  className={`enrollment-label enrollment-status ${
                    enrollment.status ? enrollment.status.toLowerCase() : ""
                  }`}
                >
                  Status: {enrollment.status}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </div>
      <br /> <br />
    </div>
  );
}

export default EnrollmentsHistory;
