import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';

registerLocale('es', es);

const EdictosFilterBar = ({ initialDate, setInitialDate, finalDate, setFinalDate }) => {
    return (
        <div className="flex items-center justify-end space-x-2 font-lato h-10 bg-white px-4 py-2 rounded-full shadow-sm w-auto">
            {/* Date Range Picker */}
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <FaCalendarAlt className="text-gray-500 mr-2 text-xs" />
                <DatePicker
                    selected={initialDate}
                    onChange={(date) => setInitialDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    placeholderText="De"
                    className="bg-transparent text-gray-700 placeholder-gray-400 text-xs w-16 focus:outline-none"
                />
                <span className="text-gray-400 px-2 text-xs">|</span>
                <DatePicker
                    selected={finalDate}
                    onChange={(date) => setFinalDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    placeholderText="Hasta"
                    className="bg-transparent text-gray-700 placeholder-gray-400 text-xs w-16 focus:outline-none"
                />
            </div>

            {/* Search Button */}
            <button className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                <FaSearch className="text-xs" />
            </button>
        </div>

    );
};

export default EdictosFilterBar