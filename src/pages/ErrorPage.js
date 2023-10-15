import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  errorPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f8f8",
  },
  errorContent: {
    textAlign: "center",
  },
  errorTitle: {
    fontSize: "24px",
    color: "#ff0000",
    marginBottom: "16px",
  },
  errorMessage: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "24px",
  },
  contactButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  contactButtonHover: {
    backgroundColor: "#0056b3",
  },
};

function ErrorPage() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <main style={styles.errorPage}>
      <div style={styles.errorContent}>
        <h1>404</h1>
        <h2 style={styles.errorTitle}>Page not found</h2>
        <p style={styles.errorMessage}>
          There's an error on this page. Please try again later or contact the
          admin for assistance.
        </p>
        <button
          style={styles.contactButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
          onClick={handleBackToHome} // Call the function to navigate back to home
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}

export default ErrorPage;
