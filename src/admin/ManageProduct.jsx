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
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/ManageProduct.css"; // Import the CSS file

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Added filter for Weight Status

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(firestore, "products");
      const productsData = await getDocs(productsCollection);

      const products = productsData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleUpdateProduct = async (productId, product) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Product",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Product Name" value="${product.name}">
        <input id="swal-input2" class="swal2-input" placeholder="Product Price" value="${product.price}">
        <select id="swal-input3" class="swal2-select">
          <option value="Underweight">Underweight</option>
          <option value="Healthy Weight">Healthy Weight</option>
          <option value="Overweight">Overweight</option>
          <option value="Obesity">Obesity</option>
        </select>`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
        ];
      },
    });

    if (formValues) {
      const [newProductName, newProductPrice, newWeightStatus] = formValues;

      const updatedProduct = {
        ...product,
        name: newProductName,
        price: newProductPrice,
        weightStatus: newWeightStatus,
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
      title: "Delete Product",
      text: "Are you sure you want to delete this product? This action is irreversible.",
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

        // Filter out the deleted product
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

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "" || product.weightStatus === filterStatus)
  );

  return (
    <div>
      <SideBar>
        <div className="container product-container">
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select value={filterStatus} onChange={handleFilterStatusChange}>
              <option value="">All</option>
              <option value="Underweight">Underweight</option>
              <option value="Healthy Weight">Healthy Weight</option>
              <option value="Overweight">Overweight</option>
              <option value="Obesity">Obesity</option>
            </select>
          </div>
          <br />
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="table product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Weight Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.weightStatus}</td>
                    <td className="button-container">
                      <button
                        onClick={() => handleUpdateProduct(product.id, product)}
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </SideBar>
    </div>
  );
}

export default ManageProduct;
