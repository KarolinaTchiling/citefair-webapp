import React from "react";
import { Drawer, Box, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 250; // Set width of the Drawer

const Sidebar = ({ isOpen, toggleDrawer }) => {
  const navigate = useNavigate();
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
        <IconButton onClick={toggleDrawer} className="absolute top-2 right-2 text-white">
          <CloseIcon />
        </IconButton>

        {/* Sidebar Content */}
        <Box>
          <h2 className="text-lg pl-4 font-semibold">Menu</h2>
          <ul className="pl-4 mt-4 space-y-5">
            <button 
              className="w-full text-left transition duration-300 hover:scale-105"
              onClick={() => navigate('/results')}>
                Citation Analysis
            </button>
            <button className="w-full text-left transition duration-300 hover:scale-105">Related Articles</button>
            <button className="w-full text-left transition duration-300 hover:scale-105">Citation Diversity Statements</button>
            <button className="w-full text-left transition duration-300 hover:scale-105">Reference List</button>
          </ul>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;

