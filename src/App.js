import { Outlet } from 'react-router-dom';
import NavBar from './components/Nav';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/SignUp';

function App() {

  return(

  <AuthProvider>
      <div>
          <Outlet/>
       </div>
  </AuthProvider>

 
  )
}

export default App;
