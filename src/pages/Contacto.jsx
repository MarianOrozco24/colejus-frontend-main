import React, { useEffect } from 'react';
import ResponsiveNav from '../components/ResponsiveNav';
import { FaRegCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { Action, Fab } from 'react-tiny-fab';
import Footer from '../components/Footer';

const Contacto = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header con imagen de fondo y degradado oscuro unificado */}
            <header className="relative min-h-[60vh] pb-16 bg-[#06092E] flex flex-col justify-start items-center text-white text-center overflow-hidden">
                {/* Imagen de fondo con opacidad suave */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 z-0" 
                    style={{ backgroundImage: `url('/contact-page-image.jpeg')` }}
                ></div>
                {/* Capa de degradado corporativo */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] opacity-90 z-0"></div>

                {/* Navbar */}
                <div className="w-full z-20">
                    <ResponsiveNav />
                </div>

                {/* Contenido principal */}
                <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-28 md:mt-36 w-full max-w-4xl">
                    <h1
                        className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight"
                        style={{ lineHeight: '1.2' }}
                    >
                        Estamos para ayudarte
                    </h1>
                    <p className="text-slate-300 font-light max-w-2xl text-sm md:text-base font-lato leading-relaxed">
                        Por cualquier consulta que desee realizarnos, complete el siguiente formulario y a la brevedad nos pondremos en contacto con usted.
                    </p>

                    {/* Botones de WhatsApp Estilizados */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-8 z-10">
                        <a
                            href="https://wa.me/5492604229972" // Teléfono San Rafael
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-64 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full inline-flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] text-sm md:text-base"
                        >
                            <FaWhatsapp size={20} />
                            WhatsApp San Rafael
                        </a>

                        <a
                            href="https://wa.me/5492625422972" // Teléfono Alvear
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-64 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full inline-flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] text-sm md:text-base"
                        >
                            <FaWhatsapp size={20} />
                            WhatsApp Alvear
                        </a>
                    </div>
                </div>
            </header>

            {/* Footer Global Unificado */}
            <Footer />


            {/* Botón Flotante de WhatsApp */}
            <Fab
                mainButtonStyles={{ backgroundColor: '#5BB754' }}
                position={{ bottom: 24, right: 24 }}
                icon={<FaWhatsapp size={28} />}
                alwaysShowTitle={false}
            >
                <Action
                    onClick={() => window.open('https://wa.me/5492604229972', '_blank')}
                    style={{
                        backgroundColor: '#5BB754',
                        display: 'flex',
                        alignItems: 'center',
                        width: '150px',
                        height: '48px',
                        borderRadius: '15px',
                        padding: '8px',
                        fontFamily: 'Lato',
                        fontWeight: 400,
                        justifyContent: 'start',
                        color: 'white'
                    }}
                >
                    <FaWhatsapp className="me-1 ms-1" />
                    San Rafael
                </Action>
                <Action
                    onClick={() => window.open('https://wa.me/5492625422972', '_blank')}
                    style={{
                        backgroundColor: '#5BB754',
                        display: 'flex',
                        alignItems: 'center',
                        width: '150px',
                        height: '48px',
                        borderRadius: '15px',
                        padding: '8px',
                        fontFamily: 'Lato',
                        fontWeight: 400,
                        justifyContent: 'start',
                        color: 'white'
                    }}
                >
                    <FaWhatsapp className="me-1 ms-1" />
                    Gral. Alvear
                </Action>
            </Fab>
        </div>
    );
};

export default Contacto;