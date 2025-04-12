import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import LogButton from './LogButton'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    // Handle "End Session" (Delete Guest Account)
    const handleEndSession = async () => {
        try {
        const token = await user.getIdToken();      
        const response = await fetch(`${API_BASE_URL}/guest/delete`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete guest session");
        }

        console.log("Guest session deleted successfully!");
        await logout(navigate); // Log out and redirect

        } catch (error) {
        console.error("Error ending session:", error);
        }
    };

    return (
         <div className="py-4 px-20 flex flex-row items-center justify-between bg-white">
        
            {user?.isAnonymous ? (
            <button onClick={handleEndSession} className="font-logo text-2xl">
                CiteFairly
            </button>
            ) : (
            <button onClick={() => navigate("/")} className="font-logo text-2xl">
                CiteFairly
            </button>
            )}

            <div className="flex flex-row items-center">

                <button 
                    className="relative mr-14 text-lg after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue/50 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
                    // onClick={() => navigate('/about')}
                    >
                    About us
                </button>

                <LogButton />


            </div>
            

        </div>
    )
}

export default Navbar
