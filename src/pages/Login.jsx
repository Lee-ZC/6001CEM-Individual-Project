import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import './css/LoginSignup.css'; // Import the CSS file


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/");
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", ""); // Remove "Firebase" keyword
      Swal.fire(
        'Error',
        errorMessage,
        'error'
      );
    }
  };

  const handleReset = () => {
    navigate("/forgotpassword");
  };

  

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Your Email"
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
            placeholder="Your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>

         {/* Apply the CSS for the "Forgot Password?" text */}
         <p onClick={handleReset} className='forgotPasswordStyle'>Forgot Password?</p>
        <button type="submit" className="submit-button">Login</button>
       
      </form>
      <br></br>
      <p>Need to Signup? <Link to="/signup">Create Account</Link></p>
    </div>
  );
};

export default Login;
