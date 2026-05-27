import React from 'react';
import ToolCard from './ToolCard';
import ResponsiveNav from './ResponsiveNav';

const Header = () => {
    const toolsRow1 = [
        { name: 'Derecho fijo', link: '/derecho-fijo' },
        { name: 'Liquidaciones', link: '/liquidaciones' },
        { name: 'Edictos', link: '/edictos' },
        { name: 'Caja forense', link: 'https://cfm.org.ar/' },
    ];

    const toolsRow2 = [
        { name: 'Poder Judicial Mza', link: 'https://jusmendoza.gob.ar/' },
        { name: 'Notificaciones', link: '/novedades' },
        { name: 'Listas diarias', link: 'https://www2.jus.mendoza.gov.ar/listas/proveidos/listas.php' },
        { name: 'ATM', link: 'https://atm.mendoza.gov.ar/' },
    ];

    return (
        <div className="relative bg-gray-100">
            {/* Hero Header Section */}
            <header className="relative bg-cover bg-center pt-28 pb-20 md:pt-56 md:pb-40 px-6 text-white text-center" style={{ backgroundImage: `url('/image-1.jpeg')` }}>
                {/* Background overlay */}
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                {/* Navbar */}
                <div className="absolute top-0 left-0 right-0 z-30">
                    <ResponsiveNav />
                </div>

                {/* Hero Content inside flex/relative flow */}
                <div className="relative z-20 max-w-5xl mx-auto mt-6 flex flex-col items-center">
                    <div className="bg-[#06092E]/45 backdrop-blur-[6px] py-10 px-6 md:py-12 md:px-16 rounded-3xl border border-white/10 max-w-4xl mx-auto flex flex-col items-center shadow-xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5 z-30" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>
                            Colegio Público de <br className="hidden md:inline" /> Abogados y Procuradores
                        </h1>
                        <p className="text-sm md:text-lg font-light text-slate-200 tracking-wider max-w-2xl leading-relaxed z-30 font-lato" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                            Segunda Circunscripción Judicial de Mendoza
                            <span className="block text-yellow-500 font-semibold mt-3 text-[11px] md:text-xs uppercase tracking-[0.25em]">San Rafael • General Alvear • Malargüe</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* ToolCard Section positioned relatively below the Hero with an overlap */}
            <div className="relative z-20 -mt-16 md:-mt-20 max-w-6xl mx-auto px-4 pb-12">
                <ToolCard title="Herramientas digitales" tools={[...toolsRow1, ...toolsRow2]} />
            </div>
        </div>
    );
};

export default Header;