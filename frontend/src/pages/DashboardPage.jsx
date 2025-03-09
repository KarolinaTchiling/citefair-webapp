import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FileUploadAnalysis from "../components/FileUploadAnalysis";
import UserFiles from "../components/UserFiles";
import { useAuth } from "../AuthContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DashBoardPage() {

  const { user } = useAuth(); 
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.uid) {
        try {
          const response = await fetch(`${API_BASE_URL}/user/name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user name");
          }

          const data = await response.json();
          setFullName(`${data.firstName} ${data.lastName}`);
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };

    fetchUserName();
  }, [user]);


  return (
    <div className="flex flex-col">
        <Navbar />
            {/* Main Content Section */}
            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)] gap-6">

              <div className="h-[13vh] flex items-center justify-center">
                <h1 className="text-6xl md:text-5xl text-white font-semibold text-center">
                  Welcome, {fullName}!
                </h1>
             </div>

             <div className="flex flex-row gap-6">

                <div className="flex-[40%]">
                  <UserFiles />
                </div>
                <div className="flex-[60%]">
                  <FileUploadAnalysis />
                </div>

             </div>

            </div>
        <Footer />
    </div>
  )
}

export default DashBoardPage
