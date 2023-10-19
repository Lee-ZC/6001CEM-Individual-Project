import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Nav from "../components/Nav";

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

      <h2>Product Detail</h2>
      {product ? (
        <div>
          <h3>{product.name}</h3>
          {product.imageUrl && ( // Check if imageUrl exists
            <img
              src={product.imageUrl}
              alt="Product"
              style={{ maxWidth: "25%" }}
            />
          )}
          <p>Description: {product.description}</p>
          <p>Price: {product.price}</p>
          <p>Weight Status: {product.weightStatus}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default ProductDetail;
