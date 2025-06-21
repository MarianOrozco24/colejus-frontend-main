import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const ContactCard = ({
  name,
  profession,
  email,
  location,
  tuition,
  onClick,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-6 text-left flex justify-between items-start space-x-4 font-lato 2xl:text-base md:text-sm">
      <div>
        {/* Contact Information */}
        <h3 className="font-bold 2xl:text-2xl md:text-lg text-primary font-bakersville">
          {name}
        </h3>
        <p className="text-gray-400">{profession}</p>
        <p className="text-gray-400 mt-4">{email}</p>

        <div className="flex items-center mt-6 text-gray-500">
          <FaMapMarkerAlt className="mr-1" />
          <span className="text-gray-400">{location}</span>
        </div>
      </div>

      {/* Contact Button */}
      <div className="flex flex-col justify-between items-end h-36">
        <span className="text-gray-400">Mat. {tuition || "No disponible"}</span>
        <button
          className="px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-200"
          onClick={onClick}
        >
          Contactar
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
