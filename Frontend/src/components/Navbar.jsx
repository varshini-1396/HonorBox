import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const saveUserToDB = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleLoginSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
    setIsModalOpen(false);
    saveUserToDB({ name: decoded.name, email: decoded.email, googleId: decoded.sub });
    navigate("/");
    window.location.reload();
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
      <motion.nav
        className="w-full flex justify-center items-center mt-6 px-2"
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="w-full max-w-4xl flex items-center justify-between px-6 py-2 bg-[rgba(255,255,255,0.08)] backdrop-blur-md border border-[rgba(180,120,255,0.18)] shadow-[0_4px_32px_0_rgba(80,80,180,0.10)] rounded-full"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ fontFamily: 'Inter, Poppins, sans-serif' }}
        >
          <a href="/" className="flex items-center gap-2 text-white text-xl font-semibold select-none">
            <img src="/honorbo logo.png" alt="logo" className="w-10 h-10 object-contain rounded-full bg-transparent" style={{background: 'none'}} />
            <span className="font-bold tracking-tight">HonourBox</span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-white font-semibold text-base px-2 py-1 transition-transform duration-150 hover:scale-105 hover:underline underline-offset-8"
            >
              Home
            </a>
            {user ? (
              <>
                <span className="text-white mx-2 font-semibold hidden sm:inline">{user.name}</span>
                <button className="btn btn-error btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button
                className="text-white font-semibold text-base px-2 py-1 transition-transform duration-150 hover:scale-105 hover:underline underline-offset-8"
                onClick={() => setIsModalOpen(true)}
              >
                Login
              </button>
            )}
          </div>
        </motion.div>
        <style>{`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 8px #a78bfa) drop-shadow(0 0 2px #fff);
          }
          @media (max-width: 600px) {
            nav > div {
              padding-left: 1rem;
              padding-right: 1rem;
              gap: 1rem;
            }
            .text-xl {
              font-size: 1.1rem;
            }
            .w-10 {
              width: 2rem;
              height: 2rem;
            }
            .gap-6 {
              gap: 1rem;
            }
          }
        `}</style>
      </motion.nav>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4">
          <div className="bg-white p-6 md:p-8 flex justify-center flex-col rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-amber-500 text-center">Login</h2>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleLoginSuccess} onFailure={(err) => console.log(err)} />
            </div>
            <div className="flex justify-center mt-6">
              <button className="btn btn-primary w-full sm:w-auto" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
