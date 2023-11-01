import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import GoToTop from "../components/GoToTop";
import "./css/Setting.css"; // Import the CSS file for custom styling

const Setting = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;
      if (user) {
        // If the user is logged in, set the user information
        setUserInfo({
          userId: user.uid,
          email: user.email,
        });
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If the user is logged in, set the user information
        setUserInfo({
          userId: user.uid,
          email: user.email,
        });
      } else {
        // Handle the case where the user is not logged in
        setUserInfo(null);
      }
    });

    checkUser();

    return () => {
      // Cleanup the subscription
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
              <span className="setting-info-value">
                {userInfo ? userInfo.userId : "N/A"}
              </span>
            </div>

            <div className="setting-info-field">
              <label>Email:</label>
              <span className="setting-info-value">
                {userInfo ? userInfo.email : "N/A"}
              </span>
            </div>
          </div>

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
