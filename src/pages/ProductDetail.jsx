import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Nav from "../components/Nav";
import AddToCartButton from "../components/AddToCartButton"; // Import the new component
import "./css/ProductDetail.css";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const productDocRef = doc(firestore, "products", productId);
        const docSnapshot = await getDoc(productDocRef);

        if (docSnapshot.exists()) {
          const productData = docSnapshot.data();
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    fetchProductDetails();
  }, [productId]);

  return (
    <div>
      <Nav />
      <center>
        <br></br>
        <div className="product-detail-container">
          <div className="product-detail">
            {product ? (
              <div>
                <h3 className="product-name">{product.name}</h3>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <p className="product-description">
                  Description: {product.description}
                </p>
                <p className="product-price">Price: ${product.price}</p>
                <p className="product-weight-status">
                  Weight Status: {product.weightStatus}
                </p>
                <AddToCartButton
                  productId={productId}
                  productName={product.name}
                  price={product.price}
                />
              </div>
            ) : (
              <p>Loading product details...</p>
            )}
          </div>
        </div>
      </center>
    </div>
  );
}

export default ProductDetail;
