import React from 'react'
const ToolCard = ({ title, tools }) => {
  return (
    <div
      className="bg-primary text-white rounded-lg shadow-lg p-8 text-center relative md:h-96 pb-24 mt-6 md:mt-0 w-full"
      style={{
        background: 'linear-gradient(102deg, #282F88 -9.86%, #0A0C22 139.03%)',
      }}
    >
      <h2 className="font-normal text-4xl md:text-5xl mb-2 mt-8">Herramientas digitales</h2>
      <p className="text-gray-300 mb-6 font-lato">Accedé a las herramientas y links claves de forma rápida y sencilla.</p>

      {/* Tools Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-x-4 gap-y-3">
        {tools.map((tool, index) => (
          <a
            key={index}
            href={tool.link}
            className={`rounded-md text-center h-16 w-full flex items-center justify-center hover:bg-gray-100
      ${index < 4 ? 'bg-white text-primary' : 'bg-transparent text-white border border-white'}`}
          >
            {tool.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ToolCard;