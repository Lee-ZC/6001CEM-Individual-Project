import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./css/ForgotPassword.css"; // Import the CSS file

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;

    try {
      await sendPasswordResetEmail(auth, emailVal);
      Swal.fire(
        "Success!",
        "A password reset link has been sent to your email.",
        "success"
      );
      navigate("/login");
    } catch (error) {
      // Handle specific error cases
      switch (error.code) {
        case "auth/user-not-found":
          Swal.fire(
            "Error",
            "User not found. Please check your email and try again.",
            "error"
          );
          break;
        case "auth/invalid-email":
          Swal.fire(
            "Error",
            "Invalid email address. Please enter a valid email.",
            "error"
          );
          break;
        default:
          Swal.fire(
            "Error",
            "An error occurred. Please try again later.",
            "error"
          );
          console.error("Password reset error:", error);
      }
    }
  };

  // Function to handle navigation back to Sign Up
  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-app">
        <h1 className="forgot-password-title">Forgot Password</h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="forgot-password-form"
        >
          <input name="email" className="forgot-password-input" required />
          <br></br>
          <button className="forgot-password-button">Reset</button>
        </form>
        <br></br>
        <a className="forgot-password-link" onClick={handleBack}>
          Back to login
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;
