import {
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import GoToTop from "../components/GoToTop";
import "./css/Setting.css"; // Import the CSS file for custom styling
import { sendEmailVerification } from "firebase/auth";
import { firestore } from "../firebase"; // Import the firestore object from your firebase.js file

const Setting = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // State for form fields
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Fetch the current user's information from Firestore when the component mounts
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("User UID:", user.uid);
          // Assuming you have a 'users' collection in Firestore
          const userDoc = await firestore
            .collection("users")
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("User Data:", userData); // Add this line for debugging

            // Set the user's name in the state
            setNewName(userData.name || ""); // Adjust this according to your database structure
            setNewEmail(user.email); // Set the user's email in the state
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (newName) {
        // Update user's name if a new name is provided
        await updateProfile(auth.currentUser, { displayName: newName });
      }
      if (newEmail) {
        // Send verification email to the new email address
        await sendEmailVerification(auth.currentUser);
        Swal.fire(
          "Email Verification",
          "A verification email has been sent to your new email address. Please verify it to complete the change.",
          "info"
        );
      }
      if (newPassword) {
        // Update password if a new password is provided
        await updatePassword(auth.currentUser, newPassword);
      }

      // Check if the user has verified their email
      const user = auth.currentUser;
      if (user && user.emailVerified) {
        Swal.fire("Success!", "Your information has been updated.", "success");
      } else {
        Swal.fire(
          "Success!",
          "Your information has been updated. Please verify your email to complete the process.",
          "success"
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", "");
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout",
      });

      if (result.isConfirmed) {
        await signOut(auth);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("bmi");

        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", "");
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="setting-container">
      <Nav />
      <GoToTop />

      <div className="setting-form-container">
        <h1>Account Settings</h1>

        <form id="setting-form" onSubmit={handleUpdate}>
          <div className="setting-field">
            <label htmlFor="newName">New Name:</label>
            <input
              type="text"
              id="newName"
              name="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="setting-field">
            <label htmlFor="newEmail">New Email:</label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="setting-field">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="setting-button">
            Update
          </button>
        </form>

        <button onClick={handleLogout} className="setting-button logout-button">
          Logout
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Setting;
