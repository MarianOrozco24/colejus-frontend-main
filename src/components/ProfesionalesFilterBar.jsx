import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const FilterBar = ({ selectedLetter, setSelectedLetter, selectedLocations, setSelectedLocations }) => {
    const letters = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // Handle location checkbox changes
    const handleLocationChange = (location) => {
        const locationKey = location.toLowerCase().replace('ü', 'u');
        setSelectedLocations(prev => ({
            ...prev,
            [locationKey]: !prev[locationKey]
        }));
    };

    return (
        <div className="w-full font-lato space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:space-x-4">
            {/* Alphabet Selector */}
            <div className="overflow-x-auto">
                <div className="flex items-center space-x-2 lg:space-x-1 font-bakersville text-sm sm:text-base lg:text-lg h-full pb-2">
                {letters.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => setSelectedLetter(letter)}
                        className={`${selectedLetter === letter
                            ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold'
                            : 'text-gray-400 hover:text-gray-600'
                            } transition duration-200`}
                    >
                        {letter}
                    </button>
                ))}
                </div>
            </div>

            {/* Button Group Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl overflow-hidden shadow-lg text-xs sm:text-sm lg:text-base">
                {/* "Filtrar por ubicación" Button */}
                <div className="bg-white text-primary py-3 px-4 flex items-center justify-center space-x-2 sm:rounded-l-full">
                    <FaMapMarkerAlt />
                    <span>Filtrar por ubicación</span>
                </div>

                {/* Custom Styled Buttons with Checkboxes */}
                {[
                    { id: 'alvear', label: 'Alvear' },
                    { id: 'malargue', label: 'Malargüe' },
                    { id: 'sanRafael', label: 'San Rafael' }
                ].map((location, index) => (
                    <label
                        key={index}
                        className={`bg-primary text-white py-3 px-4 font-medium flex items-center justify-between sm:justify-center space-x-2 transition cursor-pointer ${index === 0 ? 'sm:rounded-r-none' : ''
                            } ${index === 2 ? 'sm:rounded-r-full' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedLocations[location.id]}
                            onChange={() => handleLocationChange(location.label)}
                            className="hidden peer"
                        />
                        {/* Custom Checkbox Indicator */}
                        <span
                            className={`w-4 h-4 rounded-md border-2 border-white flex items-center justify-center
                                ${selectedLocations[location.id] ? 'bg-white' : ''}`}
                        />
                        <span>{location.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;