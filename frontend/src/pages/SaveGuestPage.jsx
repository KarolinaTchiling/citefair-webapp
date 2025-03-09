import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FileUploadAnalysis from "../components/FileUploadAnalysis";
import UserFiles from "../components/UserFiles";
import { useAuth } from "../AuthContext"
import Sidebar from '../components/Sidebar.jsx';
import SaveGuest from "../components/SaveGuest";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SaveGuestPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar


  return (
    <div className="flex flex-col">
        <Navbar />
        <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />
            {/* Main Content Section */}
            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)] gap-6">

                <SaveGuest />

            </div>
        <Footer />
    </div>
  )
}

export default SaveGuestPage
