import React, { useState, useEffect } from "react";
import { auth, firestore, storage } from "../firebase"; // Make sure to import storage from firebase
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Import Firebase Storage functions
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

const AddProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [weightStatus, setWeightStatus] = useState("Underweight");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null); // Added state for product image
  const [imageURL, setImageURL] = useState(""); // State to store the image URL after upload
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

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
    if (!productName || !productPrice || !productDescription || !productImage) {
      setValidationError("Please enter product details and upload an image.");
      return;
    }

    setLoading(true);

    // Create a unique filename for the image
    const fileName = `${Date.now()}_${productImage.name}`;

    // Create a reference to the storage service, pointing at the image's location
    const storageRef = ref(storage, fileName);

    try {
      // Upload the image to Firebase Storage and wait for it to complete
      await uploadBytes(storageRef, productImage);

      // Get the image's download URL after the upload is successful
      const downloadURL = await getDownloadURL(storageRef);

      // Set the imageURL in the state
      setImageURL(downloadURL);

      // Add the product data to Firebase Firestore, including the image URL
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        weightStatus,
        imageUrl: downloadURL, // Use the downloadURL obtained from the Storage
      };

      // Add the product data to Firestore
      const docRef = await addDoc(
        collection(firestore, "products"),
        productData
      );

      setValidationError("");
      setSuccessMessage("Product added successfully!");
      setProductName("");
      setProductPrice("");
      setWeightStatus("Underweight");
      setProductDescription("");
      setProductImage(null);
      setLoading(false);
    } catch (error) {
      console.error("Error adding product: ", error);
      setLoading(false);
      setValidationError("Error adding product.");
    }
  };

  return (
    <div>
      <SideBar>
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
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Product Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
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
                <Form.Group className="mb-3">
                  <Form.Label>Weight Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={weightStatus}
                    onChange={(e) => setWeightStatus(e.target.value)}
                  >
                    <option value="Underweight">Underweight</option>
                    <option value="Healthy Weight">Healthy Weight</option>
                    <option value="Overweight">Overweight</option>
                    <option value="Obesity">Obesity</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
                {/* {imageURL && (
                  <img
                    src={imageURL}
                    alt="Product"
                    style={{ maxWidth: "100%" }}
                  />
                )} */}
                <Button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={loading}
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
      </SideBar>
    </div>
  );
};

export default AddProduct;
