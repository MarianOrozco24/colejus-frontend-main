import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

// Define your pages and their searchable content
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
        title: 'Novedades',
        content: 'Últimas noticias y actualizaciones'
    }
];

const NavBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

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
        navigate(path);
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 py-2 px-8 flex justify-between items-center mx-auto z-30 2xl:h-20 xl:h-16 bg-primary"
            style={{ borderRadius: '20px', maxWidth: 'calc(100% - 100px)', margin: '22px auto' }}
        >
            <div className="flex items-center space-x-3">
                <a href="/">
                    <img src="/logo-colegio.png" alt="Logo" className="h-9 w-auto object-contain" />
                </a>
            </div>

            <div className="flex-grow relative mx-4 text-sm" style={{ maxWidth: '435px' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="¿Qué buscas hoy?"
                    className="pl-8 pr-4 py-2 w-full rounded-full text-gray-700 focus:outline-none"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />

                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50">
                        {searchResults.map((result, index) => (
                            <div
                                key={index}
                                onClick={() => handleResultClick(result.path)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="font-medium text-primary">{result.title}</div>
                                <div className="text-sm text-gray-600 truncate">
                                    {result.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex space-x-10 text-white md:text-xs 2xl:text-sm nav-links font-bold">
                <div className="relative text-inherit">
                    <a
                        className="hover:text-gray-300 cursor-pointer flex items-center space-x-1"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span className='text-inherit'>Herramientas digitales</span>
                        <FaChevronDown />
                    </a>

                    {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <Link to="/derecho-fijo" className="block px-4 py-2 text-primary hover:bg-gray-100 text-inherit">
                                Derecho Fijo
                            </Link>
                            <Link to="/liquidaciones" className="block px-4 py-2 text-primary hover:bg-gray-100 text-inherit">
                                Liquidaciones
                            </Link>
                            <Link to="/edictos" className="block px-4 py-2 text-primary hover:bg-gray-100 text-inherit">
                                Edictos
                            </Link>
                            <Link to="/links-de-interes" className="block px-4 py-2 text-primary hover:bg-gray-100 text-inherit">
                                Links de interés
                            </Link>
                        </div>
                    )}
                </div>
                <Link to="/novedades" className="hover:text-gray-300 text-inherit">Novedades</Link>
                <Link to="/nosotros" className="hover:text-gray-300 text-inherit">Nosotros</Link>
                <Link to="/profesionales" className="hover:text-gray-300 text-inherit">Profesionales</Link>
                <Link to="/contacto" className="hover:text-gray-300 text-inherit">Contacto</Link>
            </div>
        </nav>
    );
};

export default NavBar;