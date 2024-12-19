import React from "react";
import FileUploadComponent from "../components/Upload";

function Dashboard() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Upload Page</h1>
                <FileUploadComponent  />
            </div>
        </div>
    );
}

export default Dashboard;