import React, { useContext, useEffect, useState } from 'react'

import {auth} from "../firebase"
import { onAuthStateChanged } from 'firebase/auth'
const AuthContext = React.createContext()


export function useAuth (){
    return useContext(AuthContext)
}


export  function AuthProvider({children}) {


    const [currentUser,setCurrentUser] = useState()


    function signup (email,password) {
        return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // User creation successful
          const user = userCredential.user;
          console.log('User created:', user);
        })
        .catch((error) => {
          // Handle and log the error
          console.error('Error creating user:', error.message);
        });

        
          
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          setCurrentUser(user)
        
        })
    
        return unsubscribe
      }, [])
    
    


    const value = {
        currentUser,
        signup
    }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

  
}
