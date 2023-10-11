import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase";

function ManageProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(firestore, "products");
      const productsData = await getDocs(productsCollection);

      const products = productsData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(products);
    };

    fetchProducts();
  }, []);

  const handleUpdateProduct = async (productId, product) => {
    const productDocRef = doc(firestore, `products/${productId}`);
    await updateDoc(productDocRef, product);

    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, ...product };
      }

      return product;
    });

    setProducts(updatedProducts);
  };

  const handleDeleteProduct = async (productId) => {
    const productDocRef = doc(firestore, `products/${productId}`);
    await deleteDoc(productDocRef);

    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    table: {
      width: "50%",
      margin: "0 auto",
    },
    form: {
      width: "50%",
      margin: "0 auto",
    },
  };

  return (
    <div>
      <SideBar />
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button
                    onClick={() => handleUpdateProduct(product.id, product)}
                  >
                    Update
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProduct;
