import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Container, Form, Button, Card } from "react-bootstrap";
import Nav from "../components/Nav";
import { addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./css/Checkout.css"; // Import your custom CSS for checkout styling

function Checkout() {
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    // Add more fields as needed (e.g., email, phone, payment info).
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  useEffect(() => {
    if (!auth.currentUser) {
      // User is not authenticated, handle this as needed
      return;
    }

    // Load the cart items when the component mounts
    loadCartItems(auth.currentUser.uid);
  }, []);

  const loadCartItems = async (userId) => {
    try {
      const cartCollectionRef = collection(
        firestore,
        "userCarts",
        userId,
        "cartItems"
      );

      const q = query(cartCollectionRef);

      setLoading(true);

      const querySnapshot = await getDocs(q);
      const items = [];

      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error("Error loading cart items:", error);
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleOrderSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("User not authenticated.");
      return;
    }

    const userId = user.uid;
    const total = calculateTotalPrice();

    const orderData = {
      userId,
      shippingInfo: shippingInfo,
      cartItems: cartItems,
      totalPrice: total,
      orderDate: new Date(), // Add the current date and time

      // Add other order-related data (e.g., order date, status, payment info) as needed.
    };

    try {
      // Save the order data to your database (Firestore in this example)
      const orderRef = await addOrderToFirestore(orderData);

      // Display a success message with SweetAlert
      Swal.fire({
        icon: "success",
        title: "Order Submitted",
        text: `Your order has been submitted successfully! Order ID: ${orderRef.id}`,
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to the home page
          navigate("/");
        }
      });

      // Delete the cart after the order has been submitted
      deleteCartData(userId);

      // You can also navigate to a confirmation page here
    } catch (error) {
      console.error("Error submitting the order:", error);
    }
  };

  async function deleteCartData(userId) {
    const cartCollectionRef = collection(
      firestore,
      "userCarts",
      userId,
      "cartItems"
    );

    const querySnapshot = await getDocs(cartCollectionRef);

    querySnapshot.forEach(async (doc) => {
      try {
        await deleteDoc(doc.ref);
      } catch (error) {
        console.error("Error deleting cart item:", error);
      }
    });
  }

  async function addOrderToFirestore(orderData) {
    const ordersCollectionRef = collection(firestore, "orders");

    try {
      const orderRef = await addDoc(ordersCollectionRef, orderData);
      return orderRef;
    } catch (error) {
      throw Error("Error adding order to Firestore: " + error.message);
    }
  }

  const handleRazerPay = () => {
    // Add your Razer Pay integration logic here
    // This is where you can initiate the payment process with Razer Pay
  };

  return (
    <div>
      <Nav />
      <Container>
        <h2>Checkout</h2>
        <div className="checkout-container">
          <div className="shipping-info">
            <h4>Shipping Information</h4>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zip"
                  value={shippingInfo.zip}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </div>
          <div className="order-summary">
            <h4>Order Summary</h4>
            {cartItems.map((item) => (
              <div key={item.id}>
                <p>
                  {item.productName} x {item.quantity} - $
                  {item.price * item.quantity}
                </p>
              </div>
            ))}
            <hr />
            <Card>
              <Card.Body>
                <Card.Title>Total Price</Card.Title>
                <Card.Text>${calculateTotalPrice()}</Card.Text>
              </Card.Body>
            </Card>
            {/* Add payment method information here */}
          </div>
        </div>
        <br />
        <Button
          variant="primary"
          onClick={handleOrderSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit Order"}
        </Button>
        <br />
        <Button
          variant="success" // You can customize the variant and style
          onClick={handleRazerPay} // Define the function for Razer Pay
          disabled={loading}
        >
          Pay with Razer Pay
        </Button>
      </Container>
    </div>
  );
}

export default Checkout;
