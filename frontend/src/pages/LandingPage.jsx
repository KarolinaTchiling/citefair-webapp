import React from 'react';
import Signup from "../components/Signup";
import Login from "../components/Login";
import Guest from "../components/GuestLogin";
import Logout from "../components/Logout";



function LandingPage() {
  return (

    <div>
    <h1>Hello</h1>
        <Signup/>
        <Login/>
        <br></br>
        <Guest/>
        <br></br>
        <Logout/>
    </div>
  )
}

export default LandingPage