import React, { useState } from "react";

function Navbar() {
  const navItems = [
    { text: "Help", link: "" },
    { text: "Invoicing Guide", link: "" },
  ];

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <nav className="py-4 md:py-2 custom-navbar-bg flex items-center">
      <div className="w-full">
        <div
          className={`pb-2 md:pb-0 mx-8 sm:mx-24 flex items-center text-white justify-between md:justify-start`}
        >
          <h1 className="pt-2 md:pt-0 text-xl sm:px-8 cursor-pointer">
            Invoice Generator
          </h1>
          <div
            className="md:hidden ml-auto cursor-pointer"
            onClick={toggleMenu}
          >
            <svg
              className={`w-6 h-6 text-white transition-transform transform ${
                menuVisible ? "rotate-0" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={
                menuVisible ? { border: "1px solid white", padding: "3px" } : {}
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuVisible
                    ? "M4 6h16M4 12h16M4 18h16"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </div>
          <ul className="hidden ml-4 md:ml-12 gap-4 text-sm tracking-wider md:flex">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  className="p-2 cursor-pointer hover:text-gray-300"
                  href={item.link}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ul
          className={`${
            menuVisible ? "block" : "hidden"
          } flex flex-col mx-4 sm:mx-24 py-6 gap-8 text-sm tracking-wider border-t border-gray-300`}
        >
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                className="cursor-pointer text-white hover:text-gray-300"
                href={item.link}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
