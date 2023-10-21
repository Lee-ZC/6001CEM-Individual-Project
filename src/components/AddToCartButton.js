import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

function AddToCartButton({ productId, productName, price }) {
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = async () => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      const userId = user.uid;

      const cartItemData = {
        productId: productId,
        productName: productName,
        price: price,
        quantity: quantity,
        addedAt: serverTimestamp(),
      };

      const cartCollectionRef = collection(
        firestore,
        "userCarts",
        userId,
        "cartItems"
      );

      await addDoc(cartCollectionRef, cartItemData);
      setQuantity(1);
      setShowSuccessMessage(true);

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div>
      <div className="">
        <center>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, e.target.value))}
            min="1"
          />
        </center>
      </div>
      <br />
      <button className="btn btn-primary ml-2" onClick={addToCart}>
        Add to Cart
      </button>
      {showSuccessMessage && (
        <div className="alert alert-success mt-2">Added to cart</div>
      )}
    </div>
  );
}

export default AddToCartButton;
