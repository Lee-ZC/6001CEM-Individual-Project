import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import location_logo from "../assets/location_logo.avif";
import bmi_logo from "../assets/bmi_logo.png";
import "./css/Home.css"; // Import your custom CSS for styling
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      Swal.fire(
        "Signed Out",
        "You have been signed out successfully.",
        "success"
      );
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      Swal.fire("Error", "An error occurred while signing out.", "error");
    }
  };

  return (
    <div>
      <Nav />
      <br />
      <div className="home-container">
        {/* Container 1: Fitness Nearby */}
        <Link to="/fitness" className="home-section">
          <h3>Fitness Nearby</h3>
          <img src={location_logo} alt="Location Logo" className="home-image" />
          <p>
            Discover fitness centers, gyms, and outdoor workout spots in your
            area. Stay active and healthy by finding convenient fitness options
            near you.
          </p>
        </Link>

        {/* Container 2: BMI Recommendation Food */}
        <Link to="/bmi" className="home-section">
          <h3>BMI Recommendation Food</h3>
          <img src={bmi_logo} alt="BMI Logo" className="home-image" />
          <p>
            Get personalized food recommendations based on your BMI. Maintain a
            balanced diet and make informed food choices for your health goals.
          </p>
        </Link>
      </div>
      <br /> <br /> <br />
      <Footer />
    </div>
  );
};

export default Home;
