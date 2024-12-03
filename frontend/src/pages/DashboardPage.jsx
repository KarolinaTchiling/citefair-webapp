import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import FileUploadComponent from "../components/upload";

function Dashboard() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Main Page</h1>
                <FileUploadComponent user={user} isAuthenticated={isAuthenticated} />
                <div className="text-center mb-6">
                    <Link to="/statement" className="text-blue-600 underline hover:text-blue-800 transition">
                        See your CDS
                    </Link>
                </div>
                <div className="max-w-[600px] bg-gray-50 p-4 rounded-md break-all border border-gray-300 text-sm text-gray-600">
                    <p>{user?.accessToken}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;