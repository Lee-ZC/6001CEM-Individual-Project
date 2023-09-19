import React, { useRef, useState } from   'react' ;
import { useAuth } from '../contexts/AuthContext';

import './css/LoginSignup.css'
import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

const LoginSignup = () => {
    
    const [action,setAction] = useState("Sign Up")
    const  nameRef = useRef()
    const  emailRef = useRef()
    const  passwordRef = useRef()
    const {signup,currentUser}= useAuth()


    function handleSubmit(e){
        e.preventDefault()
        signup(emailRef.current.value,passwordRef.current.value)

    }


return (


    <div className='container'>

        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>

    {currentUser && currentUser.email}
    <form>
        <div className="inputs">

            {action==="Login"?<div></div>:
            <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder='Name' required  ref={nameRef} id='name'/>
            </div>}
            
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder='Email' required  ref={emailRef}id='email'/>
            </div>

            <div className="input">
                <img src={password_icon}alt="" />
                <input type="password" placeholder='password' required ref={passwordRef}id='password' />
            </div>

            {action==="Sign Up"?<div></div>: <div className="forgot-password">Lost Password? <span>Click Here!</span></div>}

            {action==="Sign Up"?
                <div className="">
                    <button className="submit-button" type='submit'>Register</button> </div>:
                <div className="">
                    <button  className="submit-button" type='submit'>Sign In</button>
                </div>
            }

        </div>
    </form>

        

    <hr style={{ borderTop: '2px solid black' }} />


        
        <div className="submit-container" >
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>

    </div>


);



};


export default LoginSignup