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

  useEffect(() => {
    // Fetch the current user's ID
    getCurrentUserId()
      .then((userId) => {
        setCurrentUser(userId);

        if (userId) {
          // Fetch enrollments from Firestore
          fetchEnrollments(userId);
        }
      })
      .catch((error) => {
        console.error("Error getting user ID: ", error);
        setIsLoading(false);
      });
  }, []);

  const fetchEnrollments = async (userId) => {
    const enrollmentsRef = collection(firestore, "enrollments");
    const q = query(enrollmentsRef, where("userId", "==", userId));

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

        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <ul className="enrollments-list">
            {enrollments.map((enrollment, index) => (
              <li key={index} className="enrollment-item">
                <strong className="enrollment-label">Date:</strong>{" "}
                {enrollment.date} <br />
                <strong className="enrollment-label">Start Time:</strong>
                {enrollment.startTime} <br />
                <strong className="enrollment-label">End Time:</strong>
                {enrollment.endTime}
                <br />
                <strong className="enrollment-label">Total Time:</strong>
                {enrollment.totalTime} {"hours"}
                <br />
                <strong className="enrollment-label">Name:</strong>{" "}
                {enrollment.name}
                <br />
                <strong className="enrollment-label">Contact:</strong>{" "}
                {enrollment.contact}
                <br />
                <strong className="enrollment-label">Location:</strong>{" "}
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
    </div>
  );
}

export default EnrollmentsHistory;
