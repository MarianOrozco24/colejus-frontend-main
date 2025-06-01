import React from 'react'
import NavBar from '../components/NavBar'
import { FaFacebook, FaInstagram, FaRegCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { Action, Fab } from 'react-tiny-fab';

const Contacto = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="relative 2xl:h-[75vh] md:h-[85vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center" style={{ backgroundImage: `url('/contact-page-image.jpeg')` }}>
                <div className="absolute inset-0 opacity-65 z-0 bg-black"></div>

                <NavBar />

                <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
                    <h1 className="2xl:text-7xl md:text-5xl font-normal mb-3" style={{ lineHeight: '1.5' }}>
                        Estamos para ayudarte
                    </h1>
                    <p className="2xl:text-xl md:text-lg font-normal" style={{ lineHeight: '1.5' }}>
                        Por cualquier consulta que desee realizarnos, complete el siguiente formulario y a la
                    </p>
                    <p className="2xl:text-xl md:text-lg font-normal mb-6" style={{ lineHeight: '1.5' }}>
                        brevedad nos pondremos en contacto con usted.
                    </p>

                    {/* Container for WhatsApp buttons, vertically aligned */}
                    <div className="flex items-center justify-center mt-6">
                        <div className="flex flex-row items-center space-x-4">
                            <a
                                href="#whatsapp-san-rafael"
                                className="w-80 bg-green-500 text-white px-6 py-3 rounded-full inline-flex justify-center items-center"
                            >
                                WhatsApp San Rafael
                                <FaWhatsapp size={24} className="ml-4" />
                            </a>

                            <a
                                href="#whatsapp-alvear"
                                className="w-80 bg-green-500 text-white px-6 py-3 rounded-full inline-flex justify-center items-center"
                            >
                                WhatsApp Alvear
                                <FaWhatsapp size={24} className="ml-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <section className='pb-14' style={{ background: `linear-gradient(126deg, #23296D 8.55%, #12174A 71.8%)` }}>
                <div className="flex flex-col justify-center items-center text-white z-10 px-4 py-20">
                    <h2 className="2xl:text-5xl md:text-3xl font-normal mb-3" style={{ lineHeight: '1.5' }}>
                        ¡Hablemos!
                    </h2>
                    <p className="2xl:text-lg md:text-base font-normal mb-6" style={{ lineHeight: '1.5' }}>
                        Si queres contactarte con el Colegio de Abogados y Procuradores de forma directa, hacelo a través de nuestro mail
                    </p>
                </div>

                <form className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Nombre y apellido"
                                className="w-full p-3 bg-transparent border-b border-gray-400 text-white focus:outline-none"
                            />
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white">
                                <FaRegCheckCircle />
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 bg-transparent border-b border-gray-400 text-white focus:outline-none"
                            />
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white">
                                <FaRegCheckCircle />
                            </div>
                        </div>

                        <div className="col-span-2 relative">
                            <textarea
                                placeholder="Mensaje"
                                className="w-full p-3 bg-transparent border-b border-gray-400 text-white focus:outline-none"
                            />
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white">
                                <FaRegCheckCircle />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button className="bg-transparent border border-white px-6 py-3 rounded-full inline-flex items-center justify-center text-white hover:bg-white hover:text-primary transition">
                            Enviar mensaje
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </form>
            </section>

            <footer className="bg-gray-900 text-white py-6 w-full h-48">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div>
                            <p className="text-sm">
                                Segunda Circunscripción Judicial de Mendoza. <br />
                                (San Rafael - Gral. Alvear - Malargüe)
                            </p>
                        </div>

                        <div>
                            <img src="/logo-colegio.png" alt="Logo" className="h-12 w-auto" />
                        </div>

                        <span className="flex space-x-4">
                            <FaFacebook size={40} />
                            <FaInstagram size={40} />
                        </span>
                    </div>
                </div>


                <Fab
                    mainButtonStyles={{ backgroundColor: '#5BB754' }}
                    position={{ bottom: 24, right: 24 }}
                    icon={<FaWhatsapp size={28} />}
                    alwaysShowTitle={false} // Hide title tooltip since the text will be shown inside the button
                >
                    <Action
                        onClick={() => window.location.href = '#herramientas'}
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
                            justifyContent: 'start'
                        }}
                    >
                        <FaWhatsapp className='me-1 ms-1' />
                        San Rafael
                    </Action>
                    <Action
                        onClick={() => window.location.href = '#blog'}
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
                            justifyContent: 'start'
                        }}
                    >
                        <FaWhatsapp className='me-1 ms-1' />
                        General Alvear
                    </Action>
                </Fab>

            </footer>
        </div>
    )
}

export default Contacto