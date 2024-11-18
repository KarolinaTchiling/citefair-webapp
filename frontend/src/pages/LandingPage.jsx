import React from 'react'
import SignUp from "../firebase/SignUp";
import { Link } from 'react-router-dom';


function LandingPage() {
  return (

    <div>
        <h1>Hello</h1>
        <SignUp/>
        <Link to="/main">Go to Main Page</Link>
    </div>
  )
}

export default LandingPage