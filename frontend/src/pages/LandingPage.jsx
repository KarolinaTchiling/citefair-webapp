import React, { useEffect } from 'react';
import Signup from "../components/Signup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from 'react-router-dom';
import GuestDashboard from "../components/GuestDashboard";
import { useAuth } from "../AuthContext"

function LandingPage() {

  const { isAuthenticated, isGuest, } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetElement = document.getElementById(location.hash.substring(1)); // Remove '#' from hash
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  const handleScroll = () => {
    const targetElement = document.getElementById("create-account");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("Target section not found!");
    }
  };


  return (
    <div className="flex flex-col">
      <Navbar />

      {/* Main Content Section */}
      <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center h-[calc(100vh-64px)]">
        
        {/* Heading Section (20% of screen height) */}
        <div className="h-[20vh] flex items-center justify-center">
          <div className="text-5xl md:text-6xl text-white font-semibold flex flex-col md:flex-row text-center md:text-left">
            <div className="mr-6">Fair Citations.</div>
            <div className="text-yellow">Better Research.</div>
          </div>
        </div>

        {/* Subtitle Section (15% of screen height) */}
        <div className="h-[15vh] flex items-center justify-center">
          <div className="text-center text-2xl md:text-4xl text-white font-[400] max-w-4xl">
            Elevate your research with CiteFairly — 
            <span className="font-[700]"> analyze gender biases</span>, 
            <span className="font-[700]"> broaden your sources</span>, and generate
            <span className="font-[700]"> citation diversity statements</span> effortlessly.
          </div>
        </div>

        {/* "How it works" Section and Button (20% of screen height) */}
        <div className="h-[20vh] flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">
              How it works?
            </div>
            <div className="mt-1 text-sm md:text-md text-white">
              Hover over the numbers to learn more
            </div>
          </div>

          { !isAuthenticated ? (
          <button 
            className="px-12 py-2 text-2xl md:text-3xl text-black bg-yellow font-[500] rounded-full hover:bg-yellow/70 hover:scale-110 transition duration-200"
            onClick={handleScroll}>
            Get Started
          </button>
          ) : isGuest ? (
          <button 
            className="px-12 py-2 text-2xl md:text-3xl text-black bg-yellow font-[500] rounded-full hover:bg-yellow/70 hover:scale-110 transition duration-200"
            onClick={handleScroll}>
             Get Started
          </button>
          ) : (
          <button 
            className="px-12 py-2 text-2xl md:text-3xl text-black bg-yellow font-[500] rounded-full hover:bg-yellow/70 hover:scale-110 transition duration-200"
            onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
          )}
        </div>

        {/* Steps Section (35% of screen height) */}
        <div className="h-[35vh] flex items-start mt-2 justify-center w-full">
        <div className="text-white flex flex-col md:flex-row items-start justify-start gap-1 text-lg mt-1">
            {[
              {
                number: "1",
                title: "Upload your reference list",
                caption:
                  "Upload your reference list file. CiteFairly accepts .bib and .txt.",
              },
              {
                number: "2",
                title: "Get your gender bias analysis",
                caption:
                  "CiteFairly will analyze the gender of your cited authors and provide insights on any biases.",
              },
              {
                number: "3",
                title: "Diversify your sources",
                caption:
                  "Using your reference list, gender analysis, and Semantic Scholar's AI-powered recommendation algorithm, you will get recommended articles to help diversify your research.",
              },
              {
                number: "4",
                title: "Generate your CDS",
                caption:
                  "Given your provided reference list alongside any added papers from our suggestions, CiteFairly will generate your custom citation diversity statements.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="group flex flex-col items-center w-full max-w-[330px] text-left transition-transform duration-300 hover:scale-110"
              >
                {/* Number Circle */}
                <div className="bg-blue text-indigo font-bold h-16 w-16 rounded-full flex items-center justify-center text-5xl">
                  {step.number}
                </div>

                {/* Step Title */}
                <span className="mt-3 text-center">{step.title}</span>

                {/* Caption (Hidden by Default, Shows on Hover) */}
                <div className="text-white text-sm text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 mt-2">
                  {step.caption}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {(!isAuthenticated || (isAuthenticated && isGuest)) && (
      <div id="create-account"  className=" bg-indigo">
        {/* <div id="target-section"  className="h-[calc(100vh)] bg-indigo"> */}

        {/* <div className="flex flex-col items-center border border-red bg-indigo rounded-2xl mt-20 mx-20"> */}
        <div className="flex flex-col items-center bg-indigo rounded-2xl mt-10 mx-20">


        <div className="flex flex-col md:flex-row justify-center w-[65vw] gap-20 items-stretch">
          {/* Left Side - Signup */}
          <div className="flex-1 flex flex-col justify-center min-h-full">
            <div className="mb-4 text-center text-white text-2xl">Create an Account</div>
            <div className="flex-grow flex">
              <Signup />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] bg-yellow/50"></div>

          {/* Right Side - Guest Dashboard */}
          <div className="flex-1 flex flex-col justify-center min-h-full">
            <div className="mb-4 text-center text-white text-2xl">Continue Without an Account</div>
            <div className="flex-grow flex">
              <GuestDashboard />
            </div>
          </div>
        </div>

          <div className="flex flex-row items-center gap-10">
            <div className="my-16 text-center text-white text-2xl">Already have an account? </div>
              <div>
                <button 
                    className="px-10 py-1 text-md text-white bg-blue font-[500] rounded-md hover:bg-blue/80 transition duration-200"
                    onClick={() => navigate('/login')}>
                    Log in
                </button>
              </div>
          </div>

      
        </div>
        
    
      </div>
      )}

      <Footer />
  
    </div>
  );
}

export default LandingPage;
