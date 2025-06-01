import React from 'react'
import '../styles/carousel.css'

const HomeCarousel = () => {
    return (
        <section className="bg-gray-100 pt-20 2xl:pt-80 md:pt-80 mb-20">
            <div className="container mx-auto text-center">
                {/* Title */}
                <h2 className="text-3xl  2xl:text-6xl md:text-5xl font-normal text-primary">Mantenete actualizado</h2>
                <p className="text-base md:text-lg text-gray-600 mt-2" style={{ fontFamily: 'Lato' }}>
                    Enterate de todos <span className="text-primary">nuestros cursos y capacitaciones</span>
                </p>

                {/* Carousel Wrapper */}
                <div className="relative mt-20">

                    {/* Cards Container */}
                    <div className="flex justify-center space-x-4 overflow-hidden w-full">
                        {/* Card 1 */}
                        <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg snap-start">
                            <img src="/carousel-image.jpeg" alt="Blog post" className="w-full h-40 object-cover rounded-t-lg" />
                            <div className="p-4">
                                {/* Tag for Novedades */}
                                <span className="text-sm bg-indigo-100 text-primary px-2 py-1 rounded-full inline-block mb-2">Novedades</span>
                                <h3 className="font-bold text-lg text-gray-800">Nuevas leyes en el gran Mendoza y cercanías</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Ya salieron las nuevas leyes que serán vigentes este 8 de septiembre. Conocé mejor los cambios.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-gray-500 text-sm">45 min.</span>
                                    <a href="#leer" className="text-primary font-bold">Leer</a>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg snap-start">
                            <img src="/carousel-image.jpeg" alt="Blog post" className="w-full h-40 object-cover rounded-t-lg" />
                            <div className="p-4">
                                {/* Tag for Leyes */}
                                <span className="text-sm bg-indigo-100 text-primary px-2 py-1 rounded-full inline-block mb-2">Leyes</span>
                                <h3 className="font-bold text-lg text-gray-800">Nuevas leyes en el gran Mendoza y cercanías</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Ya salieron las nuevas leyes que serán vigentes este 8 de septiembre. Conocé mejor los cambios.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-gray-500 text-sm">45 min.</span>
                                    <a href="#leer" className="text-primary font-bold">Ver más</a>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg snap-start">
                            <img src="/carousel-image.jpeg" alt="Blog post" className="w-full h-40 object-cover rounded-t-lg" />
                            <div className="p-4">
                                {/* Tag for Leyes */}
                                <span className="text-sm bg-indigo-100 text-primary px-2 py-1 rounded-full inline-block mb-2">Leyes</span>
                                <h3 className="font-bold text-lg text-gray-800">Nuevas leyes en el gran Mendoza y cercanías</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Ya salieron las nuevas leyes que serán vigentes este 8 de septiembre. Conocé mejor los cambios.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-gray-500 text-sm">45 min.</span>
                                    <a href="#leer" className="text-primary font-bold">Ver más</a>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg snap-start">
                            <img src="/carousel-image.jpeg" alt="Blog post" className="w-full h-40 object-cover rounded-t-lg" />
                            <div className="p-4">
                                {/* Tag for Leyes */}
                                <span className="text-sm bg-indigo-100 text-primary px-2 py-1 rounded-full inline-block mb-2">Leyes</span>
                                <h3 className="font-bold text-lg text-gray-800">Nuevas leyes en el gran Mendoza y cercanías</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Ya salieron las nuevas leyes que serán vigentes este 8 de septiembre. Conocé mejor los cambios.
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-gray-500 text-sm">45 min.</span>
                                    <a href="#leer" className="text-primary font-bold">Ver más</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Button */}
                <a href="#blog" className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-full font-bold">
                    Ir a blog completo
                </a>
            </div>
        </section>
    )
}

export default HomeCarousel