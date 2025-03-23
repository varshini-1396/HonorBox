import React from "react";

const Navbar = () => {
  return (
    <div className="navbar bg-neutral text-neutral-content px-6">
      <div className="flex-1">
        <a className="text-xl font-bold">HonorBox</a>
      </div>
      <div className="hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a className="hover:text-primary">Home</a></li>
          <li><a className="hover:text-primary">Features</a></li>
          <li><a className="hover:text-primary">Certificates</a></li>
        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="dropdown dropdown-end lg:hidden">
        <label tabIndex={0} className="btn btn-ghost">
          ☰
        </label>
        <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
          <li><a>Home</a></li>
          <li><a>Features</a></li>
          <li><a>Certificates</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
