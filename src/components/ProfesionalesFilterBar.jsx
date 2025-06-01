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
        <div className="flex items-center justify-between space-x-4 font-lato h-16">
            {/* Alphabet Selector */}
            <div className="flex items-center 2xl:space-x-3 md:space-x-2 font-bakersville h-full 2xl:text-2xl md:text-sm">
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

            {/* Button Group Container */}
            <div className="flex items-center rounded-full overflow-hidden shadow-lg 2xl:h-11 md:h-9 2xl:text-base md:text-xs">
                {/* "Filtrar por ubicación" Button */}
                <div className="bg-white text-primary py-2 px-4 flex items-center space-x-2 rounded-l-full h-full">
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
                        className={`bg-primary text-white py-2 px-4 font-medium flex items-center space-x-2 transition cursor-pointer h-full ${index === 0 ? 'rounded-r-none' : ''
                            } ${index === 2 ? 'rounded-r-full' : ''}`}
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