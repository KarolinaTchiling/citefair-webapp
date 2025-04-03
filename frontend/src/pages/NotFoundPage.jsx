import React from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <Navbar />
        <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center h-[calc(100vh-128px)]">
        <div className="text-5xl md:text-6xl text-white font-semibold flex flex-col md:flex-row text-center md:text-left mt-32">
            <div className="mr-6">uh oh.</div>
            <div className="text-yellow">Page not found.</div>
            </div>
            <button 
                className="mt-12 px-12 py-2 text-2xl md:text-3xl text-black bg-yellow font-[500] rounded-full hover:bg-yellow/70 hover:scale-110 transition duration-200"
                onClick={() => navigate("/dashboard")}>
                Go Home
          </button>
    
        </div>
        <Footer />
     </div>
  )
}
