import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FileUploadAnalysis from "../components/FileUploadAnalysis";
import UserFiles from "../components/UserFiles";
import { useAuth } from "../contexts/AuthContext"

function DashBoardPage() {

  const { fullName } = useAuth(); 

  return (
    <div className="flex flex-col">
        <Navbar />
            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)] gap-6">

              <div className="h-[13vh] flex items-center justify-center">
              <h1 className="text-6xl md:text-5xl text-white font-semibold text-center">
                {fullName
                  ? `Welcome, ${fullName.first} ${fullName.last}!`
                  : "Welcome!"}
              </h1>
             </div>

             <div className="flex flex-row gap-6 pb-10 min-h-[70vh]">

                <div className="flex-[55%]">
                  <UserFiles />
                </div>
                <div className="flex-[45%]">
                  <FileUploadAnalysis />
                </div>

             </div>

            </div>
        <Footer />
    </div>
  )
}

export default DashBoardPage
