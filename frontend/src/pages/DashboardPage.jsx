import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DashBoardPage() {
  return (
    <div className="flex flex-col">
        <Navbar />
            {/* Main Content Section */}
            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)]">
            </div>
        <Footer />
    </div>
  )
}

export default DashBoardPage
