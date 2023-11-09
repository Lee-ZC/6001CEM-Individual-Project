import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import GoToTop from "../components/GoToTop";
import "./css/Setting.css"; // Import the CSS file for custom styling

const Setting = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    userId: "",
    email: "",
    displayName: "",
  });

  const [nameInput, setNameInput] = useState(""); // Store the user's name input

  const fetchUserDisplayName = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const email = user.email;
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const displayName = userDoc.exists() ? userDoc.data().name : "";

      setUserInfo({
        userId,
        email,
        displayName,
      });
      setNameInput(displayName); // Set the name input value
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserDisplayName();
      } else {
        setUserInfo({
          userId: "",
          email: "",
          displayName: "",
        });
      }
    });

    fetchUserDisplayName();

    return () => {
      unsubscribe();
    };
  }, []);

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
        await auth.signOut();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("bmi");
        localStorage.removeItem("height");
        localStorage.removeItem("weight");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", "");
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleSaveName = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(firestore, "users", userId);

        // Check if nameInput is not empty
        if (nameInput.trim() === "") {
          Swal.fire("Error", "Name cannot be empty", "error");
          return; // Exit the function if nameInput is empty
        }

        await updateDoc(userDocRef, {
          name: nameInput, // Update the user's name
        });

        setUserInfo({
          ...userInfo,
          displayName: nameInput, // Update the displayed name in the UI
        });

        // Show a success alert
        Swal.fire("Success", "Your name has been updated!", "success");
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
      <br />
      <br />
      <br />
      <br />
      <center>
        <div className="setting-form-container">
          <h1 className="setting-title">Account Settings</h1>

          <div className="setting-info">
            <div className="setting-info-field">
              <label>User ID:</label>
              <span className="setting-info-value">{userInfo.userId}</span>
            </div>
            <div className="setting-info-field">
              <label>Name:</label>
              <input
                type="text"
                value={nameInput}
                required
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <div className="setting-info-field">
              <label>Email:</label>
              <span className="setting-info-value">{userInfo.email}</span>
            </div>
          </div>

          <button
            onClick={handleSaveName}
            className="setting-button save-button"
          >
            Save
          </button>
          <button
            onClick={handleLogout}
            className="setting-button logout-button"
          >
            Logout
          </button>
        </div>
      </center>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Setting;
