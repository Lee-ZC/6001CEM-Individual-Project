import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { firestore } from "../firebase"; // Import your Firestore instance
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import "./css/Bmi.css"; // Import the specific CSS file

function BMI() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBMI] = useState(0);
  const [user, setUser] = useState();

  useEffect(() => {
    // Check if the user is authenticated
    const auth = getAuth(); // Get the authentication instance
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  // Load BMI data from local storage on component mount
  useEffect(() => {
    const storedBMI = localStorage.getItem("bmi");
    if (storedBMI) {
      setBMI(parseFloat(storedBMI));
    }
  }, []);

  useEffect(() => {
    async function loadBMIFromFirestore() {
      if (user) {
        try {
          // Get the user document from Firestore
          const userDocRef = doc(firestore, "users", user.uid);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            // If the document exists, get the BMI field
            const userData = docSnapshot.data();
            if (userData.bmi) {
              setBMI(userData.bmi);
            }
          }
        } catch (error) {
          console.error("Error loading BMI from Firestore:", error);
        }
      }
    }

    loadBMIFromFirestore();
  }, [user]);

  const calculateBMI = () => {
    // Calculate BMI as before
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1); // Format to one decimal point
    setBMI(bmiValue);

    // Save the BMI to local storage
    localStorage.setItem("bmi", bmiValue);

    if (user) {
      // Save the BMI to Firestore
      const userDocRef = doc(firestore, "users", user.uid);

      // Use the `updateDoc` function to add or update the BMI field
      updateDoc(userDocRef, {
        bmi: bmiValue,
      })
        .then(() => {
          console.log("BMI updated in Firestore");
        })
        .catch((error) => {
          console.error("Error updating BMI:", error);
        });
    } else {
      console.log("User is not authenticated.");
    }
  };

  return (
    <div>
      <Nav />
      <br />
      <br />
      <br />

      <div className="bmi-form">
        {/* Modified class name for the form */}
        <h2>Calculate BMI</h2>
        <label>
          Weight (in kilograms):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <label>
          Height (in centimeters):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>
        <button onClick={calculateBMI}>Calculate BMI</button>
        <p className="bmi-result">BMI: {bmi}</p>
      </div>
    </div>
  );
}

export default BMI;
