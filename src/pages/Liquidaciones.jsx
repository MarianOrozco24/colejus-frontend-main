import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/derechofijo.css";
import {
  postLiquidaciones,
  postLiquidacionesScrapp,
} from "../api/postLiquidaciones";

registerLocale("es", es);

const Liquidaciones = () => {
  const [liquidacionFormData, setLiquidacionFormData] = useState({
    concepto: "",
    tasa: "",
    capital: "",
    fecha_origen: "",
    fecha_liquidacion: "",
    imprimir: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLiquidacionDateChange = (date, fieldName) => {
    setLiquidacionFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleLiquidacionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLiquidacionFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => {
    setLiquidacionFormData({
      concepto: "",
      tasa: "",
      capital: "",
      fecha_origen: "",
      fecha_liquidacion: "",
      imprimir: false,
    });
  };

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  const handleSubmitLiquidacion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setModalVisible(true);
    setModalMessage("Calculando...");

    const payload = {
      ...liquidacionFormData,
      fecha_origen: formatDate(liquidacionFormData.fecha_origen),
      fecha_liquidacion: formatDate(liquidacionFormData.fecha_liquidacion),
      descargar_pdf: true,
    };

    try {
      await postLiquidacionesScrapp(payload);
      setModalMessage("Liquidación generada exitosamente");
    } catch (err) {
      console.error("Error generating liquidacion:", err);
      setModalMessage(err.message || "Error al generar la liquidación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalMessage("");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative 2xl:h-[70vh] md:h-[80vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>

        <NavBar />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
          <h5
            className="2xl:text-2xl md:text-xl font-normal mb-2"
            style={{ lineHeight: "1.5" }}
          >
            Liquidaciones
          </h5>
          <h1
            className="2xl:text-7xl md:text-5xl font-normal mb-6"
            style={{ lineHeight: "1.5" }}
          >
            Formularios
          </h1>
        </div>
      </header>

      {/* The Form Section */}
      <section className="relative z-20 -mt-36 flex justify-center pb-20">
        <div className="bg-white py-10 px-16 rounded-lg shadow-lg w-1/2">
          <h2 className="text-center text-2xl font-bold text-primary mb-8">
            Liquidaciones
          </h2>
          <form onSubmit={handleSubmitLiquidacion} onReset={handleReset}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Concepto */}
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Descripción del concepto a liquidar
                </label>
                <input
                  type="text"
                  name="concepto"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  placeholder="Ej: DEUDA POR HONORARIOS"
                  value={liquidacionFormData.concepto || ""}
                  onChange={handleLiquidacionChange}
                  required
                />
              </div>

              {/* Tasa */}
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Tasa
                </label>
                <select
                  name="tasa"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none font-lato"
                  onChange={handleLiquidacionChange}
                  value={liquidacionFormData.tasa || ""}
                  required
                >
                  <option value="">Seleccione una tasa</option>
                  <option value="Tasa Banco Nación Activa">
                    Tasa Banco Nación Activa
                  </option>
                  <option value="Tasa Banco Nación Libre 36 meses - Fuera de uso">
                    Tasa Banco Nación Libre 36 meses - Fuera de uso
                  </option>
                  <option value="Tasa Banco Nación Libre 60 meses - Fuera de uso">
                    Tasa Banco Nación Libre 60 meses - Fuera de uso
                  </option>
                  <option value="Tasa Banco Nación Libre 72 meses - Ley 9516">
                    Tasa Banco Nación Libre 72 meses - Ley 9516
                  </option>
                  <option value="Tasa Banco Nación Pasiva">
                    Tasa Banco Nación Pasiva
                  </option>
                  <option value="Tasa Ley 4087">Tasa Ley 4087</option>
                  <option value="Unidad de Valor Adquisitivo (UVA)">
                    Unidad de Valor Adquisitivo (UVA)
                  </option>
                </select>
              </div>

              {/* Capital */}
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Capital
                </label>
                <div className="flex items-center border-b border-gray-300">
                  <span className="text-gray-500 px-2">$</span>
                  <input
                    type="number"
                    name="capital"
                    className="w-full p-3 focus:outline-none placeholder-gray-500 font-lato"
                    placeholder="0"
                    value={liquidacionFormData.capital}
                    onChange={handleLiquidacionChange}
                    required
                  />
                </div>
              </div>

              {/* Fecha origen */}
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Fecha de origen
                </label>
                <div className="relative w-full">
                  <DatePicker
                    selected={liquidacionFormData.fecha_origen}
                    onChange={(date) =>
                      handleLiquidacionDateChange(date, "fecha_origen")
                    }
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                    required
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Fecha liquidación */}
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Fecha de liquidación
                </label>
                <div className="relative w-full">
                  <DatePicker
                    selected={liquidacionFormData.fecha_liquidacion}
                    onChange={(date) =>
                      handleLiquidacionDateChange(date, "fecha_liquidacion")
                    }
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                    required
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 font-lato mt-6">
                <button
                  type="reset"
                  className="px-4 py-2 border-gray-200 border-2 text-gray-700 rounded-lg"
                >
                  Reiniciar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg"
                >
                  Calcular
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="mt-9 pb-24">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
            {/* Otras herramientas */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Otras herramientas
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <a
                  href="/derecho-fijo"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left"
                >
                  Derecho Fijo
                </a>
                <a
                  href="#caja-forense"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left"
                >
                  Caja forense
                </a>
                <a
                  href="#edictos"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left"
                >
                  Edictos
                </a>
              </div>
            </div>

            {/* Links de interés */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Links de interés
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <a
                  href="#poder-judicial-mza"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
                >
                  Poder judicial Mza
                </a>
                <a
                  href="#listas-diarias"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
                >
                  Listas diarias
                </a>
                <a
                  href="#notificaciones"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
                >
                  Notificaciones
                </a>
                <a
                  href="#atm"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
                >
                  ATM
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <span>{modalMessage}</span>

            {!isLoading && (
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded font-lato"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Liquidaciones;
