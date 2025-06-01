import React from 'react'

const MobileHomeCarousel = () => {
    // Mock data inside the component
    const slides = [
        {
            tag: "Cursos y capacitaciones",
            title: "Ciclo de capacitaciones prácticas para operadores del derecho",
            text: "organiza Colegio de Abogados y Procuradores y Dr. Manuel A. Sáez.",
            duration: "25/10/24",
        },
        {
            tag: "Seminarios",
            title: "Seminario de Ética y Derecho",
            text: "Una jornada de discusión sobre la ética en el derecho moderno.",
            duration: "10/11/24",
        },
        {
            tag: "Conferencias",
            title: "Conferencia sobre Nuevas Leyes",
            text: "Análisis de las leyes que entraron en vigencia en 2024.",
            duration: "15/12/24",
        },
        {
            tag: "Webinars",
            title: "Webinar sobre Transformación Digital",
            text: "Exploración del impacto de la digitalización en el ámbito legal.",
            duration: "05/01/25",
        },
    ];

    return (
        <section className="bg-gray-100 pt-20 2xl:pt-80 md:pt-80 mb-10">
            <div className="container mx-auto text-center">
                {/* Title */}
                <h2 className="text-3xl 2xl:text-6xl md:text-5xl font-normal text-primary">
                    Mantenete actualizado
                </h2>
                <p className="text-base md:text-lg text-gray-600 mt-2" style={{ fontFamily: 'Lato' }}>
                    Enterate de todos <span className="text-primary">nuestros cursos y capacitaciones</span>
                </p>

                {/* Carousel Wrapper */}
                <div className="relative mt-20">
                    <div className="overflow-x-auto">
                        <div className="flex space-x-4 px-4">
                            {slides.map((slide, index) => (
                                <div key={index} className="min-w-[300px] bg-white rounded-lg shadow-md flex flex-col justify-between">
                                    {/* Image */}
                                    <img
                                        src="/image-5.jpeg"
                                        alt={slide.title}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                    />

                                    {/* Card content */}
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            {/* Tag as a label */}
                                            <span className="inline-block bg-blue-100 text-blue-500 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                                                {slide.tag}
                                            </span>

                                            {/* Title */}
                                            <h2 className="text-lg font-bold mb-2 text-left">
                                                {slide.title}
                                            </h2>

                                            {/* Text */}
                                            <p className="text-sm text-gray-700 mb-4 text-left">
                                                {slide.text}
                                            </p>
                                        </div>

                                        {/* Date and Button Row */}
                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="text-sm text-gray-500 font-lato">{slide.duration}</div>
                                            <button className="bg-primary text-white px-4 py-2 rounded-full text-xs">
                                                Ver más
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <a href="#blog" className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-full font-bold">
                    Ir a blog completo
                </a>
            </div>
        </section>
    );
}

export default MobileHomeCarousel