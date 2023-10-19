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
import { Link } from "react-router-dom";

function BMI() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBMI] = useState(0);
  const [user, setUser] = useState();
  const [bmiStatus, setBMIStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
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
            if (userData.weight) {
              setWeight(userData.weight);
            }
            if (userData.height) {
              setHeight(userData.height);
            }
            if (userData.bmiStatus) {
              setBMIStatus(userData.bmiStatus);
            }
          }
        } catch (error) {
          console.error("Error loading data from Firestore:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadBMIFromFirestore();

    const storedBMI = localStorage.getItem("bmi");
    const storedWeight = localStorage.getItem("weight");
    const storedHeight = localStorage.getItem("height");
    const storedBmiStatus = localStorage.getItem("bmiStatus");

    if (storedBMI) {
      setBMI(parseFloat(storedBMI));
    }
    if (storedWeight) {
      setWeight(parseFloat(storedWeight));
    }
    if (storedHeight) {
      setHeight(parseFloat(storedHeight));
    }
    if (storedBmiStatus) {
      setBMIStatus(storedBmiStatus);
    }

    setLoading(false);
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
    localStorage.setItem("weight", weight);
    localStorage.setItem("height", height);

    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);

      updateDoc(userDocRef, {
        bmi: bmiValue,
        weight: weight,
        height: height,
        bmiStatus: status,
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

  useEffect(() => {
    if (bmiStatus) {
      setLoading(true); // Set loading to true before querying products

      const productsRef = collection(firestore, "products");
      const q = query(productsRef, where("weightStatus", "==", bmiStatus));
      getDocs(q)
        .then((querySnapshot) => {
          const productsArray = [];
          querySnapshot.forEach((doc) => {
            productsArray.push({ id: doc.id, ...doc.data() });
          });
          setProducts(productsArray);
        })
        .finally(() => {
          setLoading(false); // Set loading to false when data is fetched
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
        <h3>Relevant Product {bmiStatus}</h3>
      </center>

      <center>
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            {products.length > 0 ? (
              <div>
                {products.map((product) => (
                  <div className="shopping-cart" key={product.id}>
                    <ul>
                      <li>
                        <Link to={`/product/${product.id}`}>
                          <strong>{product.name}</strong>
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products available for the selected BMI status.</p>
            )}
          </div>
        )}
      </center>

      <br />
    </div>
  );
}

export default BMI;
