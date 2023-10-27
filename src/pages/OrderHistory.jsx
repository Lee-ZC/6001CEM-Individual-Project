import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Container, Card } from "react-bootstrap";
import Nav from "../components/Nav";
import "./css/OrderHistory.css"; // Import your custom CSS file for Order History styling

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, load order history
        loadOrderHistory(user.uid);
      } else {
        // User is not authenticated, reset the order history
        setOrderHistory([]);
        setLoading(false);
      }
    });

    // Cleanup the subscription when the component unmounts
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
                        <Card.Text>Name:{item.productName}</Card.Text>
                        <Card.Text>Quantity: {item.quantity}</Card.Text>
                        <Card.Text>Price: ${item.price}</Card.Text>
                      </div>
                    ))}
                    <Card.Text className="mt-3">
                      Total Price: ${order.totalPrice}
                    </Card.Text>
                    {/* Add other order details here */}
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
