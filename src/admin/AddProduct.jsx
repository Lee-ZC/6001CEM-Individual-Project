import React, { useState, useEffect } from "react";
import { auth, firestore, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert, Form, Button, Container, Row, Col } from "react-bootstrap";
import SideBar from "./components/SideBar";
import "./css/AddProduct.css"; // Import your custom CSS

const AddProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [weightStatus, setWeightStatus] = useState("Underweight");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
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

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productDescription || !productImage) {
      setValidationError("Please enter product details and upload an image.");
      return;
    }

    setLoading(true);
    const fileName = `${Date.now()}_${productImage.name}`;
    const storageRef = ref(storage, fileName);

    try {
      await uploadBytes(storageRef, productImage);
      const downloadURL = await getDownloadURL(storageRef);
      setImageURL(downloadURL);

      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        weightStatus,
        imageUrl: downloadURL,
      };

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
          <center>
            {successMessage && (
              <Row className="mt-4">
                <Col lg={6}>
                  <Alert variant="success" className="success-message">
                    {successMessage}
                  </Alert>
                </Col>
              </Row>
            )}
            {validationError && (
              <Row className="mt-4">
                <Col lg={6}>
                  <Alert variant="danger" className="error-message">
                    {validationError}
                  </Alert>
                </Col>
              </Row>
            )}
          </center>
          <Row className="mt-4">
            <Col lg={12}>
              <Form className="add-product-page">
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    isInvalid={validationError}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationError}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    Product Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Product Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="form-input"
                  />
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Product Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Product Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    isInvalid={validationError}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationError}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Weight Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={weightStatus}
                    onChange={(e) => setWeightStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="Underweight">Underweight</option>
                    <option value="Healthy Weight">Healthy Weight</option>
                    <option value="Overweight">Overweight</option>
                    <option value="Obesity">Obesity</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Product Image</Form.Label>
                  <div className="input-group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="product-image-input"
                      id="productImageInput"
                    />
                  </div>
                </Form.Group>

                <Button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
        <br /> <br />
      </SideBar>
    </div>
  );
};

export default AddProduct;
