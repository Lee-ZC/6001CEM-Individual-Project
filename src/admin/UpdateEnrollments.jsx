import React, { useEffect, useState } from "react";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import SideBar from "./components/SideBar";

import "./css/UpdateEnrollments.css"; // Import your custom CSS

function UpdateEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all enrollments from Firestore
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    const enrollmentsRef = collection(firestore, "enrollments");

    try {
      const querySnapshot = await getDocs(enrollmentsRef);
      const enrollmentData = [];

      querySnapshot.forEach((doc) => {
        enrollmentData.push({ id: doc.id, ...doc.data() });
      });

      setEnrollments(enrollmentData);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (enrollmentId, newStatus) => {
    try {
      const enrollmentDocRef = doc(firestore, "enrollments", enrollmentId);
      await updateDoc(enrollmentDocRef, { status: newStatus });
      console.log("Enrollment status updated successfully.");
      // Update the local state to reflect the change
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment.id === enrollmentId
            ? { ...enrollment, status: newStatus }
            : enrollment
        )
      );
    } catch (error) {
      console.error("Error updating enrollment status:", error);
    }
  };

  return (
    <div>
      <SideBar>
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
                  <strong className="enrollment-label">Start Time:</strong>{" "}
                  {enrollment.startTime} <br />
                  <strong className="enrollment-label">End Time:</strong>{" "}
                  {enrollment.endTime} <br />
                  <strong className="enrollment-label">Total Time:</strong>{" "}
                  {enrollment.totalTime} hours
                  <br />
                  <strong className="enrollment-label">Name:</strong>{" "}
                  {enrollment.name} <br />
                  <strong className="enrollment-label">Contact:</strong>{" "}
                  {enrollment.contact} <br />
                  <strong className="enrollment-label">Location:</strong>{" "}
                  {enrollment.fitnessLocation} <br /> <br />
                  <strong
                    className={`enrollment-label enrollment-status ${
                      enrollment.status ? enrollment.status.toLowerCase() : ""
                    }`}
                  >
                    Status: {enrollment.status}
                  </strong>
                  <div>
                    <br />
                    {enrollment.status === "pending" && (
                      <button
                        onClick={() => updateStatus(enrollment.id, "approved")}
                      >
                        Approve
                      </button>
                    )}
                    {enrollment.status === "pending" && (
                      <button
                        onClick={() => updateStatus(enrollment.id, "rejected")}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <br /> <br />
      </SideBar>
    </div>
  );
}

export default UpdateEnrollments;
