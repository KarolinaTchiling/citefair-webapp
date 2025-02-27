import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";

const Footer = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
          await logout();
          console.log("User logged out!");
        } catch (error) {
          console.error("Logout failed:", error.message);
        }
      };

    return (
        // <div className="border-2 border-indigo-600 py-4 px-20 flex flex-row items-center justify-between">
         <div className="py-4 px-20 flex flex-row items-center justify-between bg-white">

            <div className="font-logo text-2xl">
                CiteFairly
            </div>

            <div className="flex flex-row items-center">

                <button 
                    className="relative mr-14 text-lg after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue/50 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
                    // onClick={() => navigate('/about')}
                    >
                    About us
                </button>

                <button 
                    className="px-8 py-1 text-md text-white bg-red font-[500] rounded-md hover:bg-red/80 transition duration-200"
                    onClick={handleLogout}>
                    Log Out
                </button>

            </div>
            

        </div>
    )
}

export default Footer