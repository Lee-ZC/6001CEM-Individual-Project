import { signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Nav from '../components/Nav'; // Import the Nav component
import Footer from '../components/Footer'; // Import the Footer component



const Home = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();






  return (
    <div>
        <Nav /> {/* Render the Nav component */}
        


      <h1>Welcome to HealthHub</h1>

      <h2>{user && user.email}</h2>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Footer /> {/* Render the Nav component */}
    </div>
  )


}

export default Home