import React from 'react';
import Signup from "../components/Signup";
import Login from "../components/Login";
import Logout from "../components/Logout";



function LandingPage() {
  return (
    <div>

      <div className="pt-10 flex flex-row justify-center gap-7">
          <div className="flex w-[400px]"><Signup/></div>
          <div className="flex w-[400px]"><Login/></div>
      </div>

      <Logout/>

     </div>
  )
}

export default LandingPage