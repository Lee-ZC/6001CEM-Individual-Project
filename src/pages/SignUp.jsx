import React, { useState } from 'react';
import { auth, firestore } from '../firebase'; // Assuming you have imported Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore methods
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/LoginSignup.css'; // Import the CSS file
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import { ThreeDots } from 'react-loader-spinner'; // Import the ThreeDots loader

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user details to Firestore
      const userRef = collection(firestore, 'users');
      const newUser = {
        uid: user.uid,
        email: email,
        name: name,
      };

      await addDoc(userRef, newUser);

      // Store user data in localStorage
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Account Register Successfully',
        showConfirmButton: false,
        timer: 1500
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", "");
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
          />
        </div>
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>

        <button type="submit" className="submit-button">
          {isLoading ? (
            <ThreeDots color="#ffffff" height={20} width={40} /> // Use ThreeDots
          ) : (
            'Register'
          )}
        </button>
        
      </form>
      <p>Need to Login? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;
