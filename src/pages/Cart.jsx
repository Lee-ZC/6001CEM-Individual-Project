import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc as firestoreDoc,
  // Import setDoc function from 'firebase/firestore'
  setDoc,
} from "firebase/firestore"; // Import Firestore functions
import { Button, Card, Form } from "react-bootstrap";
import Nav from "../components/Nav";
import "./css/Cart.css"; // Import your CSS file for this component

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadCartItems(user.uid);
      } else {
        setUser(null);
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadCartItems = async (userId) => {
    try {
      const cartCollectionRef = collection(
        firestore,
        "userCarts",
        userId,
        "cartItems"
      );

      const querySnapshot = await getDocs(cartCollectionRef);
      const items = [];

      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  const handleRemoveFromCart = async (item) => {
    try {
      const cartItemRef = firestoreDoc(
        firestore,
        "userCarts",
        user.uid,
        "cartItems",
        item.id
      );
      await deleteDoc(cartItemRef); // Delete the item from Firestore
      // After deleting, reload the cart items to reflect the change
      loadCartItems(user.uid);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Function to update the quantity in Firestore
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      return; // Avoid negative or zero quantity
    }

    try {
      const cartItemRef = firestoreDoc(
        firestore,
        "userCarts",
        user.uid,
        "cartItems",
        item.id
      );
      await setDoc(cartItemRef, { quantity: newQuantity }, { merge: true });
      // Merge is set to true to only update the quantity field
      // After updating, reload the cart items to reflect the change
      loadCartItems(user.uid);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div>
      <Nav />
      <br />
      <div className="cart-container">
        <div className="cart-content">
          <h2>Shopping Cart</h2>
          {user ? (
            cartItems.length > 0 ? (
              cartItems.map((item) => (
                <Card key={item.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>{item.productName}</Card.Title>
                    <Card.Text>Price: ${item.price}</Card.Text>
                    <Form.Group>
                      <Form.Label>Quantity:</Form.Label>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item, parseInt(e.target.value))
                        }
                        min="1"
                      />
                    </Form.Group>
                    <br />
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      Remove from Cart
                    </Button>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )
          ) : (
            <p>Please sign in to view your cart.</p>
          )}
        </div>
      </div>
      <br />
    </div>
  );
}

export default Cart;
