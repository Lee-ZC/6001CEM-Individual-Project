import { signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Nav from '../components/Nav'; // Import the Nav component
import Footer from '../components/Footer'; // Import the Footer component



const Setting = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();



  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout'
      });
  
      if (result.isConfirmed) {
        await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.message.replace("Firebase: ", ""); // Remove "Firebase" keyword
      Swal.fire(
        'Error',
        errorMessage, 
        'error'
      )
    }
  }
  



  return (
    <div>
        <Nav /> {/* Render the Nav component */}
        


      <h1>Welcome to HealthHub</h1>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2>
      <h2>{user && user.email}</h2> <h2>{user && user.email}</h2> <h2>{user && user.email}</h2> <h2>{user && user.email}</h2> <h2>{user && user.email}</h2>
      <button onClick={handleLogout}>Logout</button>


      <Footer /> {/* Render the Nav component */}
    </div>
  )


}

export default Setting