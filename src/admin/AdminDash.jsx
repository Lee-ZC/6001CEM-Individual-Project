import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import {
  Alert,
  ToastContainer,
  Form,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import SideBar from "./components/SideBar";

const AdminDash = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (validationError) {
      setTimeout(() => {
        setValidationError("");
      }, 5000);
    }

    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  }, [validationError, successMessage]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    });
  };

  const handleAddProduct = async () => {
    // Validate the form data
    if (!productName || !productPrice) {
      setValidationError("Please enter a product name and price.");
      return;
    }

    // Start loading
    setLoading(true);

    // Add the product data to Firebase Firestore
    const productData = {
      name: productName,
      price: parseFloat(productPrice),
    };

    try {
      const docRef = await addDoc(
        collection(firestore, "products"),
        productData
      );
      console.log("Product added with ID: ", docRef.id);

      // Clear the validation error
      setValidationError("");

      // Set the success message
      setSuccessMessage("Product added successfully!");

      // Clear the form
      setProductName("");
      setProductPrice("");

      // Stop loading
      setLoading(false);
    } catch (error) {
      console.error("Error adding product: ", error);
      // Stop loading in case of an error
      setLoading(false);
    }
  };

  return (
    <div>
      <SideBar />
      <Container>
        <Row className="mt-4">
          <Col lg={6}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  isInvalid={validationError}
                />
                <Form.Control.Feedback type="invalid">
                  {validationError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Product Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  isInvalid={validationError}
                />
                <Form.Control.Feedback type="invalid">
                  {validationError}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                type="button"
                onClick={handleAddProduct}
                disabled={loading} // Disable the button when loading
              >
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </Form>
            <Button variant="danger" onClick={handleSignOut} className="mt-3">
              Logout
            </Button>
          </Col>
        </Row>
        {successMessage && (
          <Row className="mt-4">
            <Col lg={6}>
              <Alert variant="success">{successMessage}</Alert>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AdminDash;
