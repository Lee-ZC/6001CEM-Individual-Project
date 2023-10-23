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
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import Nav from "../components/Nav";
import "./css/Cart.css"; // Import your CSS file for this component
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
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

  const handleCheckoutClick = () => {
    // Use the navigate function to go to the checkout page
    navigate("/checkout");
  };

  // Calculate the total price of all items in the cart
  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div>
      <Nav />
      <br />
      <Container>
        <h2>Shopping Cart</h2>
        {user ? (
          cartItems.length > 0 ? (
            <div>
              {cartItems.map((item) => (
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
              ))}
              <div className="total-section">
                <Row>
                  <Col md={8}>
                    <p>Total Price:</p>
                  </Col>
                  <Col md={4}>
                    <p>${calculateTotalPrice()}</p>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  className="checkout-button"
                  onClick={handleCheckoutClick}
                >
                  Checkout
                </Button>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )
        ) : (
          <p>Please sign in to view your cart.</p>
        )}
      </Container>
      <br />
    </div>
  );
}

export default Cart;
