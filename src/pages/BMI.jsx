import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { firestore } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./css/Bmi.css";

function BMI() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBMI] = useState(0);
  const [user, setUser] = useState();
  const [bmiStatus, setBMIStatus] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

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
          const userDocRef = doc(firestore, "users", user.uid);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
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
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBMI(bmiValue);

    let status = "";
    if (bmiValue < 18.5) {
      status = "Underweight";
    } else if (bmiValue < 24.9) {
      status = "Healthy Weight";
    } else if (bmiValue < 29.9) {
      status = "Overweight";
    } else {
      status = "Obesity";
    }
    setBMIStatus(status);

    localStorage.setItem("bmi", bmiValue);

    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);

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

  // Query products based on BMI status
  useEffect(() => {
    if (bmiStatus) {
      const productsRef = collection(firestore, "products");
      const q = query(productsRef, where("weightStatus", "==", bmiStatus));
      getDocs(q).then((querySnapshot) => {
        const productsArray = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsArray);
      });
    }
  }, [bmiStatus]);

  return (
    <div>
      <Nav />

      <div className="bmi-container">
        <div className="bmi-form">
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
        <div className="bmi-status-container">
          {bmiStatus && <p className="bmi-status">Status: {bmiStatus}</p>}
        </div>
      </div>

      <hr />
      <center>
        {/* <h3>--- Products for {bmiStatus} --- </h3> */}
        <h3>Relevant Product {bmiStatus}</h3>
      </center>

      <center>
        {products.length > 0 && (
          <div>
            {products.map((product) => (
              <div className="shopping-cart" key={product.id}>
                <ul>
                  <li>
                    <strong>{product.name}</strong> - {product.description}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </center>
      <br />
    </div>
  );
}

export default BMI;
