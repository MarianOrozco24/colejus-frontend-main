import React from 'react'

const MobileHomeCarousel = () => {
    const slides = [
        {
            title: "Curso de Posgrado en Derecho Procesal Civil",
            text: "Actualización práctica integral sobre el Código Procesal Civil, Comercial y Tributario de Mendoza y sus últimas reformas.",
            tag: "Capacitación",
            duration: "Próximamente",
            image: "/image-2.jpeg"
        },
        {
            title: "Taller de Práctica Profesional: Sistema IURIX",
            text: "Manejo práctico del portal IURIX, firma digital avanzada, carga de escritos y notificaciones electrónicas obligatorias.",
            tag: "Taller Práctico",
            duration: "Sáb. 13 de Junio",
            image: "/image-5.jpeg"
        },
        {
            title: "Seminario de Actualización en Derecho Laboral",
            text: "Nuevas tendencias en la jurisprudencia y criterios prácticos aplicados por las Cámaras del Trabajo de la 2da Circunscripción.",
            tag: "Seminario",
            duration: "Jue. 25 de Junio",
            image: "/image-1.jpeg"
        },
        {
            title: "Charla de Iniciación Profesional",
            text: "Aspectos prácticos de la matriculación, Caja Forense, honorarios mínimos y primeros pasos clave en el ejercicio libre.",
            tag: "Jóvenes Abogados",
            duration: "Mié. 1 de Julio",
            image: "/carousel-image.jpeg"
        }
    ];

    return (
        <section className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] py-16 px-4">
            <div className="container mx-auto text-center">
                {/* Title */}
                <h2 className="text-3xl font-serif font-semibold text-primary tracking-tight mb-2">Formación y Capacitación</h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-10 font-lato">
                    Impulsando el desarrollo y la actualización constante de los profesionales del derecho.
                </p>

                {/* Carousel Wrapper */}
                <div className="relative mt-8">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-5 px-2 pb-6 snap-x snap-mandatory">
                            {slides.map((slide, index) => (
                                <div key={index} className="min-w-[290px] w-[290px] bg-white rounded-2xl shadow-md snap-start flex flex-col justify-between overflow-hidden border border-slate-100 min-h-[400px]">
                                    {/* Image */}
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[10px] font-semibold bg-primary/95 text-white px-2.5 py-1 rounded-full shadow-sm">
                                                {slide.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card content */}
                                    <div className="p-4 flex-grow flex flex-col justify-between text-left">
                                        <div>
                                            {/* Title */}
                                            <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-snug mb-2">
                                                {slide.title}
                                            </h3>

                                            {/* Text */}
                                            <p className="text-xs text-gray-600 font-lato line-clamp-3 leading-relaxed mb-4">
                                                {slide.text}
                                            </p>
                                        </div>

                                        {/* Date and Button Row */}
                                        <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-50">
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                                                <span>📅</span>
                                                <span>{slide.duration}</span>
                                            </div>
                                            <a href="/contacto" className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                                Inscribirse
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="mt-6">
                    <a href="/novedades" className="inline-block bg-primary text-white hover:bg-primary/95 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">
                        Ver todas las novedades
                    </a>
                </div>
            </div>
        </section>
    );
}

export default MobileHomeCarousel