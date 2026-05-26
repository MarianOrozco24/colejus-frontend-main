import React from 'react'
import { 
  FaBalanceScale, 
  FaCalculator, 
  FaNewspaper, 
  FaUniversity, 
  FaGavel, 
  FaBell, 
  FaClipboardList, 
  FaCreditCard 
} from 'react-icons/fa';

const toolIcons = {
  'Derecho fijo': FaBalanceScale,
  'Liquidaciones': FaCalculator,
  'Edictos': FaNewspaper,
  'Caja forense': FaUniversity,
  'Poder Judicial Mza': FaGavel,
  'Notificaciones': FaBell,
  'Listas diarias': FaClipboardList,
  'ATM': FaCreditCard,
};

const ToolCard = ({ title, tools }) => {
  return (
    <div
      className="bg-primary text-white rounded-2xl shadow-2xl p-8 md:p-12 text-center relative w-full border border-white/10"
      style={{
        background: 'linear-gradient(135deg, #1A1F66 0%, #06092E 100%)',
      }}
    >
      <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-3 tracking-tight">Herramientas Digitales</h2>
      <p className="text-gray-300 max-w-2xl mx-auto mb-10 font-lato text-sm md:text-base leading-relaxed">
        Accedé a las herramientas y links claves de la Segunda Circunscripción de forma rápida y sencilla.
      </p>

      {/* Tools Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
        {tools.map((tool, index) => {
          const IconComponent = toolIcons[tool.name];
          return (
            <a
              key={index}
              href={tool.link}
              className={`rounded-xl px-5 h-16 w-full flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-md
        ${index < 4 
          ? 'bg-white text-primary hover:bg-gray-50' 
          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
            >
              {IconComponent ? (
                <IconComponent className={`text-xl flex-shrink-0 ${index < 4 ? 'text-primary' : 'text-white'}`} />
              ) : (
                <span className="text-xl">🔗</span>
              )}
              <span className="font-semibold text-sm tracking-wide">{tool.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ToolCard;