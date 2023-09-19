import React, { useState } from 'react'
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'



const Signup = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Account Register Successfully',
        showConfirmButton: false,
        timer: 1500
      })
      navigate("/");
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", ""); // Remove "Firebase" keyword
      Swal.fire(
        'Error',
        errorMessage,
        'error'
      );
    }
  }
  

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit} className='signup-form'>
        <input
          type="email"
          placeholder="Your Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='signup-button'>Signup</button>
      </form>
      <p>Need to Login? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Signup