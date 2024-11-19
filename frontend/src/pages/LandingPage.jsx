import React from 'react'
import SignUp from "../firebase/SignUp";
import SignIn from "../firebase/SignIn";
// import { Link } from 'react-router-dom';


function LandingPage() {
  return (

    <div>
        <h1>Hello</h1>
        <SignUp/>
        <SignIn/>
    </div>
  )
}

export default LandingPage