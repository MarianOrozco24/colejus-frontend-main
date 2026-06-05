import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

// Define pages and their searchable content
const pages = [
  {
    path: '/derecho-fijo',
    title: 'Derecho Fijo',
    content: 'Información sobre derecho fijo y trámites relacionados'
  },
  {
    path: '/liquidaciones',
    title: 'Liquidaciones',
    content: 'Sistema de liquidaciones y pagos'
  },
  {
    path: '/edictos',
    title: 'Edictos',
    content: 'Publicación y consulta de edictos'
  },
  {
    path: '/novedades',
    title: 'Novedades',
    content: 'Últimas noticias y actualizaciones'
  },
  {
    path: '/profesionales',
    title: 'Profesionales',
    content: 'Consulta de profesionales y matrícula'
  },
  {
    path: '/backoffice/reservar-sala',
    title: 'Reserva de Salas',
    content: 'Reserva de salas y espacios de reunión'
  },
  {
    path: '/contacto',
    title: 'Contacto',
    content: 'Información de contacto y ubicación de sedes'
  }
];

const NavBarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const toggleTools = (e) => {
    e.preventDefault();
    setIsToolsExpanded(!isToolsExpanded);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = pages.filter(page =>
      page.title.toLowerCase().includes(term.toLowerCase()) ||
      page.content.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
    setShowResults(true);
  };

  const handleResultClick = (path) => {
    setSearchTerm('');
    setShowResults(false);
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Sleek, Compact Mobile Header Bar (64px Height) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary z-40 px-4 flex items-center justify-between shadow-md border-b border-white/5">
        {!isSearchOpen ? (
          <>
            {/* Logo Left */}
            <Link to="/" className="flex items-center">
              <img src="/logo-colegio.png" alt="Logo" className="h-8 w-auto object-contain" />
            </Link>

            {/* Buttons Right */}
            <div className="flex items-center gap-2">
              {/* Search Icon Button */}
              <button 
                className="text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none" 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Hamburger Button */}
              <button 
                className="text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none" 
                onClick={togglePanel}
                aria-label="Menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* Animated Search Bar Mode */
          <div className="w-full flex items-center gap-2 animate-fade-in">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="¿Qué buscas hoy?"
                className="w-full bg-white text-gray-800 placeholder-gray-400 pl-10 pr-10 py-1.5 rounded-full text-sm outline-none border-none"
                autoFocus
              />
              {/* Search icon inside input */}
              <span className="absolute left-3.5 top-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              
              {/* Clear search text button */}
              {searchTerm && (
                <button 
                  onClick={() => handleSearch('')}
                  className="absolute right-3.5 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Cancel Button */}
            <button 
              className="text-white text-xs font-semibold px-2 py-2 hover:text-slate-200 transition-colors focus:outline-none" 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchTerm('');
                setShowResults(false);
              }}
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Floating Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-16 left-4 right-4 bg-white rounded-xl shadow-2xl z-50 py-2 border border-slate-100 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleResultClick(result.path)}
                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
              >
                <div className="font-semibold text-primary text-sm">{result.title}</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">
                  {result.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side Panel Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary text-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Top logo */}
          <div className="flex justify-center mt-6">
            <Link to="/" onClick={togglePanel}>
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
                  <Link to="/derecho-fijo" onClick={togglePanel} className="text-base">
                    Derecho Fijo
                  </Link>
                  <Link to="/liquidaciones" onClick={togglePanel} className="text-base">
                    Liquidaciones
                  </Link>
                  <Link to="/edictos" onClick={togglePanel} className="text-base">
                    Edictos
                  </Link>
                  <Link to="/links-de-interes" onClick={togglePanel} className="text-base">
                    Links de interés
                  </Link>
                  <Link to="/backoffice/reservar-sala" onClick={togglePanel} className="text-base">
                    Reserva de Salas
                  </Link>
                </div>
              )}
            </div>

            <Link to="/novedades" onClick={togglePanel} className="text-lg font-semibold">
              Novedades
            </Link>
            <Link to="/nosotros" onClick={togglePanel} className="text-lg font-semibold">
              Nosotros
            </Link>
            <Link to="/profesionales" onClick={togglePanel} className="text-lg font-semibold">
              Profesionales
            </Link>
            <Link to="/contacto" onClick={togglePanel} className="text-lg font-semibold">
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