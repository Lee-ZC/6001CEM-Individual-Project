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
import Swal from "sweetalert2";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(firestore, "products");
      const productsData = await getDocs(productsCollection);

      const products = productsData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(products);
      setLoading(false); // Set loading to false when data is fetched
    };

    fetchProducts();
  }, []);

  const handleUpdateProduct = async (productId, product) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Product",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Product Name" value="' +
        product.name +
        '">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Product Price" value="' +
        product.price +
        '">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (formValues) {
      const [newProductName, newProductPrice] = formValues;

      // Update the product object with the new values
      const updatedProduct = {
        ...product,
        name: newProductName,
        price: newProductPrice,
      };

      try {
        const productDocRef = doc(firestore, `products/${productId}`);
        await updateDoc(productDocRef, updatedProduct);

        const updatedProducts = products.map((p) => {
          if (p.id === productId) {
            return updatedProduct;
          }
          return p;
        });

        setProducts(updatedProducts);
      } catch (error) {
        console.error(error);
        const errorMessage = error.message.replace("Firebase: ", "");
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action is irreversible. Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const productDocRef = doc(firestore, `products/${productId}`);
        await deleteDoc(productDocRef);

        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error(error);
        const errorMessage = error.message.replace("Firebase: ", "");
        Swal.fire("Error", errorMessage, "error");
      }
    }
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
    loading: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1C2833",
    },
  };

  return (
    <div>
      <SideBar />
      <div style={styles.container}>
        {loading ? ( // Display loading screen if loading is true
          <div>Loading...</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default ManageProduct;
