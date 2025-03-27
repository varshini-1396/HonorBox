import { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
    localStorage.setItem("user", JSON.stringify(decoded)); // Store user in localStorage
    setIsModalOpen(false);
    saveUserToDB({ name: decoded.name, email: decoded.email, googleId: decoded.sub });
    navigate("/");
    window.location.reload();
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
    window.location.reload();
  };

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content px-6">
        <div className="flex-1">
          <a className="text-xl font-bold flex gap-2" href="/"> <img src="./honorbo logo.png" alt="" className="w-10" />HonorBox</a>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <ul className="menu menu-horizontal ">
            <li><a className="text-primary" href="/">Home</a></li>
            {user ? (
              <>
                <li className="text-white mx-9 justify-center font-semibold" >{user.name}</li>
                <li>
                  <button className="btn btn-error" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <button 
                  className="hover:text-primary" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            ☰
          </label>
          <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
            <li><a href="/" className="justify-center my-2">Home</a></li>
            {user ? (
              <>
                <li className="text-white font-semibold text-center my-2">{user.name}</li>
                <li>
                  <button className="btn btn-error btn-md" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => setIsModalOpen(true)}>Login</button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Login Modal */}
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
