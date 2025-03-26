import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in by verifying the token in cookies
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/user`, {
          credentials: "include", // Allows cookies to be sent
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="navbar bg-neutral text-neutral-content px-6">
      <div className="flex-1">
        <a className="text-xl font-bold" href="/">HonorBox</a>
      </div>
      <div className="hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a className="hover:text-primary" href="/">Home</a></li>
          {user ? (
            <>
              <li><a className="hover:text-primary">Welcome, {user.name}</a></li>
              <li><a className="hover:text-primary" href={`${import.meta.env.VITE_BACKEND_URL}/auth/logout`}>Logout</a></li>
            </>
          ) : (
            <li>
              <a className="hover:text-primary" href={`${import.meta.env.VITE_BACKEND_URL}/auth/github`}>
                Login
              </a>
            </li>
          )}
          <li><a className="hover:text-primary">Certificates</a></li>
        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="dropdown dropdown-end lg:hidden">
        <label tabIndex={0} className="btn btn-ghost">
          ☰
        </label>
        <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
          <li><a href="/">Home</a></li>
          <li><a>Features</a></li>
          <li><a>Certificates</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
