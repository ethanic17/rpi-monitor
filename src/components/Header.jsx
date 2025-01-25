import React from "react";

import Colors from "../constants/Colors";

import "../index.css";

import logo from "../assets/images/Pi.ico";

const Header = () => {
  return (
    <header className="bg-gray-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="rpi-logo" className="w-10 h-10" />
          <h1
            style={{ color: Colors.accent500 }}
            className="text-2xl font-bold p-1"
          >
            Raspberry Pi Monitor
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
