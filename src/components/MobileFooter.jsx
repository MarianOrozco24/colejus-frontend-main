import React from 'react'
import { FaFacebook, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Action, Fab } from 'react-tiny-fab';

const MobileFooter = () => {
    return (
        <>
            <section className="bg-white 2xl:text-base md:text-sm">
                <div className="bg-primary shadow-lg flex flex-col md:flex-row overflow-hidden">

                    {/* Left Image and WhatsApp Section */}
                    <div className="relative md:w-2/5 flex items-center justify-center p-8"
                        style={{
                            background: `linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), 
                url('/contact-us-image.jpeg') lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <div className="relative z-10 text-center">
                            <img src="/logo-grande.png" alt="Colegio Público de Abogados y Procuradores" className="mx-auto mb-4 h-16" />

                            <div className="flex flex-col space-y-4 items-center">
                                <a href="#whatsapp-san-rafael" className="w-80 bg-green-500 text-white px-6 py-3 rounded-full inline-flex justify-center">
                                    WhatsApp San Rafael
                                    <FaWhatsapp size={24} className='ml-4' />
                                </a>

                                <a href="#whatsapp-alvear" className="w-80 bg-green-500 text-white px-6 py-3 rounded-full inline-flex justify-center">
                                    WhatsApp Alvear
                                    <FaWhatsapp size={24} className='ml-4' />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (Contact Form) */}
                    <div className="md:w-2/3 p-8 md:p-12 bg-primary text-white flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">¡Hablemos!</h1>
                        <p className="text-gray-200 mb-8">
                            Si quieres contactarte con el Colegio de Abogados, hacelo a través de nuestro mail
                        </p>

                        {/* Contact Form */}
                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Nombre y apellido"
                                    className="p-3 bg-transparent border-b border-gray-400 text-white focus:outline-none w-full"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="p-3 bg-transparent border-b border-gray-400 text-white focus:outline-none w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    placeholder="Mensaje"
                                    className="p-3 w-full bg-transparent border-b border-gray-400 text-white focus:outline-none"
                                />
                            </div>
                            <button className="bg-transparent border border-white px-6 py-3 rounded-full inline-flex items-center justify-center text-white hover:bg-white hover:text-primary transition">
                                Enviar mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-900 text-white py-6 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        {/* Logo */}
                        <div>
                            <img src="/logo-colegio.png" alt="Logo" className="h-12 w-auto mb-4" />
                        </div>

                        {/* Footer Text */}
                        <p className="text-sm">
                            Segunda Circunscripción Judicial de Mendoza. <br />
                            (San Rafael - Gral. Alvear - Malargüe)
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-4">
                            <FaFacebook size={30} />
                            <FaInstagram size={30} />
                        </div>
                    </div>
                </div>

                {/* Floating WhatsApp Button */}
                <Fab
                    mainButtonStyles={{ backgroundColor: '#5BB754' }}
                    position={{ bottom: 24, right: 24 }}
                    icon={<FaWhatsapp size={28} />}
                    alwaysShowTitle={false}
                >
                    <Action
                        onClick={() => window.location.href = '#whatsapp-san-rafael'}
                        style={{
                            backgroundColor: '#5BB754',
                            display: 'flex',
                            alignItems: 'center',
                            width: '150px',
                            height: '48px',
                            borderRadius: '15px',
                            padding: '8px',
                            fontFamily: 'Lato',
                            justifyContent: 'start'
                        }}
                    >
                        <FaWhatsapp className='mr-2' />
                        San Rafael
                    </Action>
                    <Action
                        onClick={() => window.location.href = '#whatsapp-alvear'}
                        style={{
                            backgroundColor: '#5BB754',
                            display: 'flex',
                            alignItems: 'center',
                            width: '150px',
                            height: '48px',
                            borderRadius: '15px',
                            padding: '8px',
                            fontFamily: 'Lato',
                            justifyContent: 'start'
                        }}
                    >
                        <FaWhatsapp className='mr-2' />
                        General Alvear
                    </Action>
                </Fab>
            </footer>
        </>

    )
}

export default MobileFooter