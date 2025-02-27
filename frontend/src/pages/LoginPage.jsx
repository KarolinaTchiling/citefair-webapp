import React, { useEffect, useState  } from 'react';
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import GoogleSignIn from '/google_signin.svg';


const LoginPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // ✅ Scrolls to the top when the page loads
  }, []);

  const { login, continueAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("User logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center h-[calc(100vh-64px)]">

        <div className="mb-4 text-center text-white text-3xl">Log in to your an Account</div>

        <div className="w-[40%] flex flex-col bg-white rounded-lg p-8">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-row items-center justify-between mx-3">

              <button 
                  className="px-16 py-2 text-md text-white bg-blue font-[500] rounded-md hover:bg-blue/80 transition duration-200"
                  onClick={() => navigate('/login')}>
                  Log in
              </button>

              <p>or</p>

              <button onClick={() => signUpWithGoogle(navigate)} className="group">
                <img src={GoogleSignIn} className="h-12 transition duration-200 group-hover:brightness-75" />
              </button>

            </div>

          </form>



        </div>

        <div className="text-white flex flex-col mt-20">
          <p className="text-3xl">
            Don't have an account or don't want one?
          </p>
          <div className="flex flex-row mt-5 justify-between">

          <p className="text-xl">Create one or try it out as a guest.</p>

          <button 
            className="px-16 py-1 text-md text-white bg-blue font-[500] rounded-md hover:bg-blue/80 transition duration-200"
            onClick={() => navigate('/#target-section')}>
            Click here
          </button>

          </div>

        </div>


      </div>
      <Footer />
    </div>
  )
}

export default LoginPage
