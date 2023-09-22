import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;

    try {
      await sendPasswordResetEmail(auth, emailVal);
      Swal.fire(
        'Success!',
        'A password reset link has been sent to your email.',
        'success'
      );
      navigate("/login");
    } catch (error) {
      // Handle specific error cases
      switch (error.code) {
        case "auth/user-not-found":
          Swal.fire(
            'Error',
            'User not found. Please check your email and try again.',
            'error'
          );
          break;
        case "auth/invalid-email":
          Swal.fire(
            'Error',
            'Invalid email address. Please enter a valid email.',
            'error'
          );
          break;
        default:
          Swal.fire(
            'Error',
            'An error occurred. Please try again later.',
            'error'
          );
          console.error("Password reset error:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Forgot Password</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input name="email" /><br/><br/>
        <button>Reset</button>
      </form>
    </div>
  );
}

export default ForgotPassword;

// import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
// import React, { useState } from "react";
// import { auth } from '../firebase';
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {
//   const navigate = useNavigate();
//   const [emailError, setEmailError] = useState();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const emailVal = e.target.email.value;

//     try {
//       const methods = await fetchSignInMethodsForEmail(auth, emailVal);
//       if (methods.length === 0) {
//         setEmailError("Email does not exist.");
//       } else {
//         await sendPasswordResetEmail(auth, emailVal);
//         alert("Check your email for a password reset link.");
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Password reset error:", error);
//       setEmailError("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Forgot Password</h1>
//       <form onSubmit={(e) => handleSubmit(e)}>
//         <input name="email" /><br/><br/>
//         <button>Reset</button>
//         {emailError && <p style={{ color: "red" }}>{emailError}</p>}
//       </form>
//     </div>
//   );
// }

// export default ForgotPassword;

