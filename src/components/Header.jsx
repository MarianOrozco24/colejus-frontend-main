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
        <header className="relative 2xl:h-[75vh] md:h-[85vh] h-auto bg-cover bg-center" style={{ backgroundImage: `url('/image-1.jpeg')` }}>
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black opacity-70 md:opacity-60 z-0"></div>

            <ResponsiveNav />

            {/* Centered Content with higher z-index */}
            <div className="inset-0 flex flex-col justify-center items-center text-white text-center z-20 pt-52 px-8 md:pt-0 md:absolute">
                <h1 className="text-3xl mb-4 md:text-5xl 2xl:text-6xl z-30" style={{ maxWidth: '800px', lineHeight: '1.2', textShadow: '0 3px 6px rgba(0,0,0,0.7)' }}>
                    Colegio Público de
                </h1>
                <h1 className="text-2xl mb-4 md:text-5xl 2xl:text-6xl z-30" style={{ maxWidth: '800px', lineHeight: '1.2', textShadow: '0 3px 6px rgba(0,0,0,0.7)' }}>
                    Abogados y Procuradores
                </h1>
                <p className="text-sm md:text-lg 2xl:text-xl font-bakersville z-30" style={{ fontFamily: 'Libre Baskerville, serif !important', textShadow: '0 3px 6px rgba(0,0,0,0.7)' }}>
                    Segunda Circunscripción Judicial de Mendoza. (San Rafael - Gral. Alvear - Malargüe)
                </p>
            </div>

            {/* ToolCard Section */}
            <div className="w-full mt-8 md:absolute md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 md:translate-y-1/2 z-10">
                <div className="container mx-auto">
                    <div className="w-11/12 md:w-4/5 mx-auto pb-5 pt-8 md:pt-36">
                        <ToolCard title="Herramientas digitales" tools={[...toolsRow1, ...toolsRow2]} />
                    </div>
                </div>
            </div>
        </header>

    );
};

export default Header;