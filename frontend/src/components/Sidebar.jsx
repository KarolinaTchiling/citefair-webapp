import React, { useEffect, useState } from "react";
import { Drawer, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const drawerWidth = 250; // Set width of the Drawer

const Sidebar = ({ isOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the authenticated user
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const fetchGuestStatus = async () => {
      if (user?.uid) {
        try {
          const response = await fetch(`${API_BASE_URL}/guest/isGuest?uid=${user.uid}`);

          if (!response.ok) {
            throw new Error("Failed to fetch guest status");
          }

          const data = await response.json();
          setIsGuest(data.isGuest);
        } catch (error) {
          console.error("Error fetching guest status:", error);
        }
      }
    };

    fetchGuestStatus();
  }, [user]);

  return (
    <>
      {/* Button to Open Drawer */}
      <IconButton 
        onClick={toggleDrawer} 
        sx={{ 
            color: "white",
            position: "absolute",
            top: "80px", // equivalent to Tailwind's top-20 (80px)
            left: "20px", // adjust as needed
            backgroundColor: "transparent",
            boxShadow: "none",
            width: "auto" // remove fixed width
        }}
        >
        <MenuIcon fontSize="large"/>
        </IconButton>


      {/* MUI Drawer */}
      <Drawer
        variant="temporary" // "temporary" makes it collapsible
        open={isOpen} // Controls if it's open
        onClose={toggleDrawer} // Closes on outside click
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "calc(100vh - 64px)",
            top: "64px",
            boxSizing: "border-box",
            backgroundColor: "#1e1e2f",
            color: "white",
            padding: "16px",
          },
        }}
      >
        <Toolbar />
        {/* Close Button */}
        <IconButton onClick={toggleDrawer}
          sx={{ 
            color: "white",
            position: "absolute",
            top: "25px", // equivalent to Tailwind's top-20 (80px)
            left: "20px", // adjust as needed
            backgroundColor: "transparent",
            boxShadow: "none",
            width: "auto" // remove fixed width
          }}>
          <CloseIcon />
        </IconButton>

        {/* Sidebar Content */}
        <Box>
          <h2 className="text-lg pl-4 font-semibold mt-5">Menu</h2>
          <ul className="pl-4 mt-4 space-y-5">
            <button 
              className="w-full text-left transition duration-300 hover:scale-105"
              onClick={() => navigate('/results')}>
                Citation Analysis
            </button>

            <button 
              className="w-full text-left transition duration-300 hover:scale-105"
              onClick={() => navigate('/recommended')}>
                Recommended Articles
            </button>
            
            <button 
              className="w-full text-left transition duration-300 hover:scale-105"
              onClick={() => navigate('/statements')}>
                Citation Diversity Statements
            </button>

            <button 
              className="w-full text-left transition duration-300 hover:scale-105"
              onClick={() => navigate('/reference-list')}>
                Reference List
            </button>

            {/* 🔹 Hide "Back to Dashboard" for Guest Users */}
            {!isGuest && (
              <button 
                className="w-full text-left transition duration-300 pt-7 font-bold hover:scale-105"
                onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
              </button>
            )}

            {isGuest && (
              <button 
                className="w-full text-left transition duration-300 pt-7 font-bold hover:scale-105"
                onClick={() => navigate('/save-guest')}>
                  Create an Account to Save Results
              </button>
            )}
            
          </ul>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;

