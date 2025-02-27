import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";



const ReferenceListPage = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    return (
        <div>
            <Navbar />
            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />     

            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center h-[calc(100vh-64px)]">
            
            </div>
        </div>
    )
}

export default ReferenceListPage;