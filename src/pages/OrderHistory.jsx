import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Container, Card, Button } from "react-bootstrap";
import Nav from "../components/Nav";
import emailjs from "emailjs-com";
import "./css/OrderHistory.css";

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null); // Added userEmail state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set the user's email
        loadOrderHistory(user.uid);
      } else {
        setOrderHistory([]);
        setLoading(false);
        setUserEmail(null); // Reset the userEmail if the user is not authenticated
      }
    });

    return unsubscribe;
  }, []);

  const loadOrderHistory = async (userId) => {
    try {
      const ordersCollectionRef = collection(firestore, "orders");
      const q = query(ordersCollectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      setOrderHistory(orders);
      setLoading(false);
    } catch (error) {
      console.error("Error loading order history:", error);
      setLoading(false);
    }
  };

  const sendInvoiceByEmail = (orderId, cartItems, totalPrice) => {
    // Replace these values with your email service credentials
    const serviceID = "service_6zj45nh";
    const templateID = "template_1b6eiqs";
    const userID = "2As6iK4Bwjnq2SXef";

    emailjs.init(userID);

    if (userEmail) {
      const itemsList = cartItems.map((item) => {
        return `${item.productName} (Quantity: ${item.quantity}, Price: $${item.price})`;
      });

      const emailContent = `Invoice for Order ID ${orderId}\n\nCart Items:\n${itemsList.join(
        "\n"
      )}\n\nTotal Price: $${totalPrice}`;

      const templateParams = {
        to_email: userEmail,
        from_name: "Health-Hub",
        message: emailContent,
      };

      emailjs.send(serviceID, templateID, templateParams).then(
        function (response) {
          alert("Invoice sent successfully!");
        },
        function (error) {
          console.error("Error sending invoice:", error);
          alert("Failed to send the invoice.");
        }
      );
    } else {
      alert("User is not authenticated.");
    }
  };

  return (
    <div>
      <Nav />
      <Container>
        <h2 className="mt-4">Order History</h2>
        <div className="order-history-container">
          {loading ? (
            <p>Loading order history...</p>
          ) : orderHistory.length === 0 ? (
            <p>No order history available.</p>
          ) : (
            <div>
              {orderHistory.map((order) => (
                <Card key={order.id} className="mb-4">
                  <Card.Header className="bg-primary text-white">
                    Order ID: {order.id}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="mb-3">Cart Items:</Card.Text>
                    {order.cartItems.map((item) => (
                      <div key={item.id} className="cart-item-container mb-2">
                        <Card.Text>Name: {item.productName}</Card.Text>
                        <Card.Text>Quantity: {item.quantity}</Card.Text>
                        <Card.Text>Price: ${item.price}</Card.Text>
                      </div>
                    ))}
                    <Card.Text className="mt-3">
                      Total Price: ${order.totalPrice}
                    </Card.Text>
                    <Button
                      onClick={() =>
                        sendInvoiceByEmail(
                          order.id,
                          order.cartItems,
                          order.totalPrice
                        )
                      }
                    >
                      E-invoice
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default OrderHistory;
