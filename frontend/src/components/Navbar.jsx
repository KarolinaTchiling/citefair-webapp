import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogButton from './LogButton'

const Navbar = () => {
    const navigate = useNavigate();

    return (
        // <div className="border-2 border-indigo-600 py-4 px-20 flex flex-row items-center justify-between">
         <div className="py-4 px-20 flex flex-row items-center justify-between bg-white">

            <button 
                className="font-logo text-2xl"
                onClick={() => navigate('/')}>
                CiteFairly
            </button>

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
