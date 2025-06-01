import React, { useState } from 'react'
import { FaFacebook, FaInstagram, FaChevronDown } from "react-icons/fa";
import { Link } from 'react-router-dom';

const NavBarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const toggleTools = (e) => {
    e.preventDefault();
    setIsToolsExpanded(!isToolsExpanded);
  };

  return (
    <>
      <div className="flex flex-col md:hidden fixed top-0 left-0 right-0 p-6 bg-primary z-40 items-center justify-center rounded-b-lg shadow-lg">
        {/* Logo */}
        <div className="w-full flex justify-center my-6">
          <Link to="/">
            <img src="/logo-colegio.png" alt="Logo" className="h-10" />
          </Link>
        </div>

        {/* Search Bar and Hamburger Menu */}
        <div className="w-full flex justify-between items-center">
          <input
            type="text"
            placeholder="¿Qué buscas hoy?"
            className="bg-white px-4 py-2 rounded-full w-3/4 text-gray-700 text-sm outline-none"
          />
          <button className="text-white ml-4" onClick={togglePanel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary text-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Top logo */}
          <div className="flex justify-center mt-6">
            <Link to="/">
              <img src="/logo-colegio.png" alt="Colegio Logo" className="h-10" />
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col items-center space-y-6 mt-8">
            {/* Herramientas digitales dropdown */}
            <div className="flex flex-col items-center w-full">
              <button
                onClick={toggleTools}
                className="text-lg font-semibold flex items-center space-x-2"
              >
                <span>Herramientas digitales</span>
                <FaChevronDown className={`transform transition-transform ${isToolsExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isToolsExpanded && (
                <div className="flex flex-col items-center space-y-4 mt-4 w-full bg-primary-dark py-4">
                  <Link to="/derecho-fijo" className="text-base">
                    Derecho Fijo
                  </Link>
                  <Link to="/liquidaciones" className="text-base">
                    Liquidaciones
                  </Link>
                  <Link to="/edictos" className="text-base">
                    Edictos
                  </Link>
                  <Link to="/links-de-interes" className="text-base">
                    Links de interés
                  </Link>
                </div>
              )}
            </div>

            <Link to="/novedades" className="text-lg font-semibold">
              Novedades
            </Link>
            <Link to="/nosotros" className="text-lg font-semibold">
              Nosotros
            </Link>
            <Link to="/profesionales" className="text-lg font-semibold">
              Profesionales
            </Link>
            <Link to="/contacto" className="text-lg font-semibold">
              Contacto
            </Link>
          </nav>

          {/* Social media icons */}
          <div className="flex justify-center space-x-4 mt-8">
            <FaFacebook size={24} />
            <FaInstagram size={24} />
          </div>

          {/* Bottom logo */}
          <div className="flex justify-center mb-32">
            <img src="/isologo-white.svg" alt="Isologo" className="h-16" />
          </div>

          {/* Close Button */}
          <button
            onClick={togglePanel}
            className="absolute top-4 right-4 text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={togglePanel}
        ></div>
      )}
    </>
  );
};

export default NavBarMobile;