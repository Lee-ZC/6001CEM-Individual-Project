import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Container, Card, Button, Form } from "react-bootstrap";
import Nav from "../components/Nav";
import emailjs from "emailjs-com";
import "./css/OrderHistory.css";

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        loadOrderHistory(user.uid);
      } else {
        setOrderHistory([]);
        setLoading(false);
        setUserEmail(null);
      }
    });

    return unsubscribe;
  }, []);

  const loadOrderHistory = async (userId) => {
    try {
      const ordersCollectionRef = collection(firestore, "orders");
      const q = query(
        ordersCollectionRef,
        where("userId", "==", userId),
        orderBy("orderDate", "desc")
      );
      const querySnapshot = await getDocs(q);

      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      setOrderHistory(orders);
      setFilteredHistory(orders);
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

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      return date.toLocaleString();
    } else {
      return "N/A";
    }
  };

  const handleDateFilter = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate === "") {
      setFilteredHistory(orderHistory);
    } else {
      // Filter orders by selected date using formatted strings
      const formattedSelectedDate = new Date(selectedDate).toLocaleDateString();

      const filteredOrders = orderHistory.filter((order) => {
        const formattedFirestoreDate = new Date(
          order.orderDate.toDate()
        ).toLocaleDateString();
        return formattedFirestoreDate === formattedSelectedDate;
      });
      setFilteredHistory(filteredOrders);
    }
  };

  return (
    <div>
      <Nav />
      <Container>
        <h2 className="mt-4">Order History</h2>
        <Form.Group>
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={handleDateFilter}
            style={{ width: "200px" }}
          />
        </Form.Group>
        <div className="order-history-container">
          {loading ? (
            <p>Loading order history...</p>
          ) : orderHistory.length === 0 ? (
            <p>No order history available.</p>
          ) : (
            <div>
              {filteredHistory.map((order) => (
                <Card key={order.id} className="mb-4">
                  <Card.Header className="bg-primary text-white">
                    Order ID: {order.id}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="mb-3">
                      Order Date: {formatDate(order.orderDate)}
                    </Card.Text>
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
                      className="e-invoice-button" // Add the class name
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
