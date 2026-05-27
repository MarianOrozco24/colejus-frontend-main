import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const FilterBar = ({ selectedProfession, setSelectedProfession, selectedLocations, setSelectedLocations }) => {
    const professions = [
        { id: 'Todos', label: 'Todos' },
        { id: 'Abogado', label: 'Abogados' },
        { id: 'Procurador', label: 'Procuradores' }
    ];

    // Handle location checkbox changes
    const handleLocationChange = (location) => {
        const locationKey = location.toLowerCase().replace('ü', 'u');
        setSelectedLocations(prev => ({
            ...prev,
            [locationKey]: !prev[locationKey]
        }));
    };

    return (
        <div className="w-full font-lato flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(18,23,74,0.03)] border border-slate-100">
            {/* Profesión / Título Selector (Premium Chips) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-gray-500 font-medium mr-1 font-lato text-xs md:text-sm">
                    Tipo de matrícula:
                </span>
                {professions.map((prof) => {
                    const isActive = selectedProfession === prof.id;
                    return (
                        <button
                            key={prof.id}
                            onClick={() => setSelectedProfession(prof.id)}
                            className={`px-5 py-1.5 rounded-full border transition-all duration-300 font-bold text-xs md:text-sm shadow-sm ${
                                isActive
                                    ? 'bg-[#06092E] text-white border-[#06092E] hover:bg-[#06092E]/95 shadow-[0_4px_10px_rgba(6,9,46,0.2)]'
                                    : 'bg-white text-gray-600 border-slate-200 hover:bg-slate-50 hover:text-gray-800'
                            }`}
                        >
                            {prof.label}
                        </button>
                    );
                })}
            </div>

            {/* Location Selector (Premium Chips) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base shrink-0">
                <span className="text-gray-500 font-medium mr-1 flex items-center gap-1.5 font-lato text-xs md:text-sm">
                    <FaMapMarkerAlt className="text-secondary shrink-0" />
                    Filtrar por ubicación:
                </span>
                {[
                    { id: 'alvear', label: 'Alvear' },
                    { id: 'malargue', label: 'Malargüe' },
                    { id: 'sanRafael', label: 'San Rafael' }
                ].map((location) => {
                    const isActive = selectedLocations[location.id];
                    return (
                        <button
                            key={location.id}
                            onClick={() => handleLocationChange(location.label)}
                            className={`px-4 py-1.5 rounded-full border transition-all duration-300 font-bold text-xs md:text-sm shadow-sm flex items-center gap-2 ${
                                isActive
                                    ? 'bg-secondary text-white border-secondary hover:bg-secondary/95 shadow-[0_4px_10px_rgba(40,47,136,0.2)]'
                                    : 'bg-white text-gray-600 border-slate-200 hover:bg-slate-50 hover:text-gray-800'
                            }`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                    isActive ? 'bg-white' : 'bg-slate-300'
                                }`}
                            />
                            {location.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterBar;