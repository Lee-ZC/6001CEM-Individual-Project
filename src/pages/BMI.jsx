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
import { setDoc } from "firebase/firestore";
import Swal from "sweetalert2"; // Import SweetAlert2

function BMI() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBMI] = useState(0);
  const [user, setUser] = useState();
  const [bmiStatus, setBMIStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Track user's favorite products

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
    try {
      // Ensure that weight and height are numeric values
      if (isNaN(weight) || isNaN(height)) {
        throw new Error("Weight and height must be numeric values.");
      }

      // Check if weight and height are non-negative
      if (weight < 0 || height < 0) {
        throw new Error("Weight and height must be non-negative values.");
      }

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
            console.error("Error updating BMI in Firestore:", error);
            Swal.fire(
              "Error",
              "Error updating BMI in Firestore: " + error.message,
              "error"
            );
          });
      } else {
        console.log("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error calculating BMI:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    // Fetch user's favorites when the component mounts
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(firestore, "user-favorite", userId);

      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setFavorites(userData.favorites || []);
          }
        })
        .catch((error) => {
          console.error(
            "Error loading user's favorites from Firestore:",
            error
          );
        });
    }
  }, [user]);

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

  const toggleFavorite = async (productId) => {
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(firestore, "user-favorite", userId);

      // Check if the document exists
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        // Document exists, update it
        let updatedFavorites = docSnapshot.data().favorites || []; // Change const to let
        if (updatedFavorites.includes(productId)) {
          // Remove the product from favorites
          updatedFavorites = updatedFavorites.filter((id) => id !== productId);
        } else {
          // Add the product to favorites
          updatedFavorites.push(productId);
        }

        // Update the document with new favorites
        await updateDoc(userDocRef, { favorites: updatedFavorites });
        setFavorites(updatedFavorites);
      } else {
        // Document doesn't exist, create it
        const favorites = [productId];
        await setDoc(userDocRef, { favorites });
        setFavorites(favorites);
      }
    }
  };

  // Function to check if a product is in favorites
  const isProductFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const generateDietPlan = () => {
    // Example diet plan recommendations based on BMI status
    let dietRecommendations = "";

    switch (bmiStatus) {
      case "Underweight":
        dietRecommendations =
          "For underweight individuals, it is important to focus on nutrient-rich foods. Include a balance of carbohydrates, proteins, and healthy fats in your diet. Consider consulting with a dietitian for personalized advice.";
        break;
      case "Healthy Weight":
        dietRecommendations =
          "Maintaining a healthy weight is great! Continue to eat a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains.";
        break;
      case "Overweight":
        dietRecommendations =
          "To manage your weight, focus on portion control and reduce intake of sugary and high-fat foods. Incorporate more fruits, vegetables, and lean proteins into your meals.";
        break;
      case "Obesity":
        dietRecommendations =
          "Obesity may require more comprehensive dietary and lifestyle changes. Consult with a healthcare professional or dietitian for a tailored plan.";
        break;
      default:
        dietRecommendations = "Please calculate your BMI first.";
        break;
    }

    return dietRecommendations;
  };

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
          <div className="diet-plan-container">
            <p className="diet-plan">Diet Plan: </p>
            {generateDietPlan()}
          </div>
        </div>
      </div>

      <hr />
      <center>
        <h3>Relevant Product: {bmiStatus}</h3>
      </center>

      <center>
        {loading ? (
          // Loading indicator
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            {products.length > 0 ? (
              // List of products
              <div>
                {products.map((product) => (
                  <div className="shopping-cart" key={product.id}>
                    <span
                      // Favorite icon
                      className="favorite-icon"
                      onClick={() => toggleFavorite(product.id)}
                      style={{
                        color: isProductFavorite(product.id) ? "red" : "grey",
                      }}
                    >
                      &#9825;
                    </span>

                    {product.imageUrl && ( // Check if imageUrl exists
                      <img
                        src={product.imageUrl}
                        alt="Product"
                        style={{ maxWidth: "25%" }}
                      />
                    )}
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
