import React from 'react'
import '../styles/carousel.css'

const HomeCarousel = () => {
    const courses = [
        {
            title: "Curso de Posgrado en Derecho Procesal Civil",
            description: "Actualización práctica integral sobre el Código Procesal Civil, Comercial y Tributario de Mendoza y sus últimas reformas.",
            tag: "Capacitación",
            date: "Próximamente",
            image: "/image-2.jpeg"
        },
        {
            title: "Taller de Práctica Profesional: Sistema IURIX",
            description: "Manejo práctico del portal IURIX, firma digital avanzada, carga de escritos y notificaciones electrónicas obligatorias.",
            tag: "Taller Práctico",
            date: "Sáb. 13 de Junio",
            image: "/image-5.jpeg"
        },
        {
            title: "Seminario de Actualización en Derecho Laboral",
            description: "Nuevas tendencias en la jurisprudencia y criterios prácticos aplicados por las Cámaras del Trabajo de la 2da Circunscripción.",
            tag: "Seminario",
            date: "Jue. 25 de Junio",
            image: "/image-1.jpeg"
        },
        {
            title: "Charla de Iniciación Profesional",
            description: "Aspectos prácticos de la matriculación, Caja Forense, honorarios mínimos y primeros pasos clave en el ejercicio libre.",
            tag: "Jóvenes Abogados",
            date: "Mié. 1 de Julio",
            image: "/carousel-image.jpeg"
        }
    ];

    return (
        <section className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] py-24 px-4">
            <div className="container mx-auto max-w-6xl text-center">
                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary tracking-tight mb-2">Formación y Capacitación</h2>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-16 font-lato">
                    Impulsando el desarrollo y la actualización constante de los profesionales del derecho.
                </p>

                {/* Cards Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-5xl mx-auto">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden border border-slate-100 min-h-[420px]">
                            <div>
                                <div className="relative h-44 overflow-hidden">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4">
                                        <span className="text-xs font-semibold bg-primary/95 text-white px-3 py-1.5 rounded-full shadow-sm">
                                            {course.tag}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-2 leading-snug mb-3 hover:text-primary transition-colors cursor-pointer">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm font-lato line-clamp-3 leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="p-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                                    <span>📅</span>
                                    <span>{course.date}</span>
                                </div>
                                <a href="/contacto" className="text-sm font-bold text-secondary hover:text-primary hover:underline transition-colors">
                                    Inscribirse
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Button */}
                <div className="mt-16">
                    <a href="/novedades" className="inline-block bg-primary text-white hover:bg-primary/95 shadow-md px-8 py-3 rounded-full font-bold transition-all transform hover:scale-[1.02]">
                        Ver todas las novedades
                    </a>
                </div>
            </div>
        </section>
    )
}

export default HomeCarousel