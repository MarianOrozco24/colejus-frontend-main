import React from 'react';
import NavBar from '../components/NavBar';
import NavBarMobile from '../components/NavBarMobile';
import Footer from '../components/Footer';
import MobileFooter from '../components/MobileFooter';

const LinksInteres = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Desktop View */}
            <div className="hidden md:block">
                <header className="relative h-[80vh] 2xl:h-[70vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
                    <div className="absolute inset-0 opacity-60 z-0" style={{ backgroundColor: '#06092E' }}></div>
                    <NavBar />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
                        <h1 className="text-5xl 2xl:text-7xl font-normal mb-6" style={{ lineHeight: '1.5' }}>
                            Links de Interés
                        </h1>
                        <h5 className="text-xl 2xl:text-2xl font-normal mb-2" style={{ lineHeight: '1.5' }}>
                            Encontrá los accesos directos a los links más usados
                        </h5>
                    </div>
                </header>

                <section className="mt-9 pb-24">
                    <div className="container mx-auto text-center">
                        <div className="grid grid-cols-2 gap-8 justify-center items-start">
                            {/* Links sections for desktop */}
                        </div>
                    </div>
                </section>
                <Footer />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden bg-primary min-h-screen text-white">
                <NavBarMobile />

                {/* Mobile Header */}
                <div className="px-6 pt-24 pb-8">
                    <h1 className="text-2xl font-normal mb-2">Links de interés</h1>
                    <p className="text-sm text-gray-300">
                        Encontrá los accesos directos a los links más usados
                    </p>
                </div>

                {/* Mobile Links Sections */}
                <div className="bg-white rounded-t-3xl px-6 pt-8 pb-4 text-gray-800">
                    {/* Otras herramientas section */}
                    <h2 className="text-xl font-semibold mb-4">Otras herramientas</h2>
                    <div className="flex flex-col space-y-4">
                        <a href="/liquidaciones" className="pb-2 border-b border-gray-200">Liquidaciones</a>
                        <a href="/edictos" className="pb-2 border-b border-gray-200">Edictos</a>
                        <a href="/caja-forense" className="pb-2 border-b border-gray-200">Caja forense</a>
                    </div>

                    {/* Links de interés section */}
                    <h2 className="text-xl font-semibold mt-8 mb-4">Links de interés</h2>
                    <div className="flex flex-col space-y-4">
                        <a href="https://jusmendoza.gob.ar/" className="pb-2 border-b border-gray-200">Poder judicial Mza</a>
                        <a href="/notificaciones" className="pb-2 border-b border-gray-200">Notificaciones</a>
                        <a href="https://www2.jus.mendoza.gov.ar/listas/proveidos/listas.php" className="pb-2 border-b border-gray-200">Listas diarias</a>
                        <a href="https://atm.mendoza.gov.ar/" className="pb-2 border-b border-gray-200">ATM</a>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="bg-primary px-6 py-8">
                    <h2 className="text-2xl font-normal mb-4">¡Hablemos!</h2>
                    <p className="text-sm text-gray-300 mb-6">
                        Si quieres contactarte con el Colegio de Abogados, hacelo a través de nuestro mail
                    </p>
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre y apellido"
                            className="w-full bg-transparent border-b border-gray-400 p-2 text-white placeholder-gray-400 focus:outline-none"
                        />
                        <textarea
                            placeholder="Mensaje"
                            className="w-full bg-transparent border-b border-gray-400 p-2 text-white placeholder-gray-400 focus:outline-none mt-4"
                            rows="3"
                        />
                        <div className="text-right">
                            <button className="bg-white text-primary px-6 py-2 rounded-full mt-4">
                                Enviar mensaje →
                            </button>
                        </div>
                    </form>
                </div>

                <MobileFooter />
            </div>
        </div>
    );
};

export default LinksInteres;