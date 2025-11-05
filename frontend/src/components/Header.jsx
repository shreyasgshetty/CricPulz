import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Series", path: "/series" },
    { name: "Matches", path: "/matches" },
    { name: "Tournaments", path: "/tournaments" },
    { name: "Rankings", path: "/rankings" },
    { name: "News", path: "/news" },
  ];

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400">
          CricPulz
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`hover:text-blue-400 transition ${
                location.pathname === item.path ? "text-blue-400 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Profile / Account */}
        <Link to="/profile" className="flex items-center space-x-2 hover:text-blue-400">
          <FaUserCircle size={24} />
          <span>Profile</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
