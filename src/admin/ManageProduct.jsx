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
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript
import "datatables.net-dt/css/jquery.dataTables.css"; // Import DataTables CSS
import "datatables.net"; // Import DataTables JavaScript
import $ from "jquery"; // Import jQuery;

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

  useEffect(() => {
    if (!loading) {
      if ($.fn.DataTable.isDataTable("#productTable")) {
        $("#productTable").DataTable().destroy();
      }
      $("#productTable").DataTable();
    }
  }, [products, loading]);

  const handleUpdateProduct = async (productId, product) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Product",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Product Name" value="' +
        product.name +
        '">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Product Price" value="' +
        product.price +
        '">' +
        '<select id="swal-input3" class="swal2-select">' +
        '<option value="Underweight">Underweight</option>' +
        '<option value="Healthy Weight">Healthy Weight</option>' +
        '<option value="Overweight">Overweight</option>' +
        '<option value="Obesity">Obesity</option>' +
        "</select>",
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

      // Update the product object with the new values
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
        // Destroy and reinitialize the DataTable
        if ($.fn.DataTable.isDataTable("#productTable")) {
          $("#productTable").DataTable().destroy();
        }
        $("#productTable").DataTable();
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
      confirmButtonColor: "#3085d6", // Red color for Delete
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const productDocRef = doc(firestore, `products/${productId}`);
        await deleteDoc(productDocRef);

        // Remove the deleted product from the state immediately
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );

        // Update the state with the updated products, triggering a re-render
        setProducts(updatedProducts);

        // Destroy and reinitialize the DataTable
        if ($.fn.DataTable.isDataTable("#productTable")) {
          $("#productTable").DataTable().destroy();
        }
        $("#productTable").DataTable();
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
      width: "110%",
      margin: "20px auto", // Add margin for spacing
      backgroundColor: "#f0f0f0", // Background color
      borderRadius: "10px", // Rounded corners
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Box shadow for depth
    },
    form: {
      width: "500%",
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
      <SideBar>
        <div style={styles.container}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table id="productTable" style={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Weight Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.weightStatus}</td>
                    <td>
                      <button
                        onClick={() => handleUpdateProduct(product.id, product)}
                        style={{
                          backgroundColor: "#50C878		",
                          marginRight: "10px",
                        }}
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ backgroundColor: "#d9534f" }} // Red color for Delete
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
