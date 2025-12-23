import React, { useState } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/derechofijo.css";
import { calcularLiquidacion } from "../api/postLiquidaciones";

registerLocale("es", es);

// Helper para pesos
const formatPesos = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value || 0);

// Card de resultado (cuadro aparte)
const LiquidacionResultado = ({ data }) => {
  const {
    concepto,
    capital,
    tasa_utilizada,
    fecha_origen,
    fecha_liquidacion,
    periodos = [],
    tasa_interes_porcentaje,
    monto_intereses,
    total_final,
  } = data;

  return (
    <div className="mt-6 md:mt-0 p-6 bg-white rounded-lg shadow-lg font-lato">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Resultado de la liquidación
      </h3>

      {/* Resumen principal */}
      <div className="grid grid-cols-1 gap-2 text-sm mb-4">
        <p>
          <span className="font-semibold text-gray-700">Concepto: </span>
          {concepto}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Capital: </span>
          {formatPesos(capital)}
        </p>
        {tasa_utilizada && (
          <p>
            <span className="font-semibold text-gray-700">Tasa utilizada: </span>
            {tasa_utilizada}
          </p>
        )}
        <p>
          <span className="font-semibold text-gray-700">Fecha de origen: </span>
          {fecha_origen}
        </p>
        <p>
          <span className="font-semibold text-gray-700">
            Fecha de liquidación:{" "}
          </span>
          {fecha_liquidacion}
        </p>
      </div>

      {/* Tabla de períodos */}
      {periodos.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <p className="font-semibold text-gray-700 mb-2 text-sm">
            Cálculo de intereses por período
          </p>
          <table className="min-w-full text-xs border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Período</th>
                <th className="border px-2 py-1 text-left">Tasa</th>
                <th className="border px-2 py-1 text-right">Días</th>
                <th className="border px-2 py-1 text-right">% sobre capital</th>
              </tr>
            </thead>
            <tbody>
              {periodos.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-1">
                    {row.fecha_desde} .. {row.fecha_hasta}
                  </td>
                  <td className="border px-2 py-1">{row.tasa}</td>
                  <td className="border px-2 py-1 text-right">{row.dias}</td>
                  <td className="border px-2 py-1 text-right">
                    {row.resultado_porcentaje}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totales */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
          <p className="font-semibold text-gray-600">
            Interés total {tasa_interes_porcentaje && `(${tasa_interes_porcentaje})`}
          </p>
          <p className="text-base font-bold">{formatPesos(monto_intereses)}</p>
        </div>
        <div className="px-3 py-2 rounded-lg bg-primary text-white">
          <p className="font-semibold text-sm">Total final</p>
          <p className="text-base font-bold">{formatPesos(total_final)}</p>
        </div>
      </div>
    </div>
  );
};

const Liquidaciones = () => {
  const [liquidacionFormData, setLiquidacionFormData] = useState({
    concepto: "",
    tasa: "",
    capital: "",
    fecha_origen: "",
    fecha_liquidacion: "",
    tasa_label: "",
    imprimir: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleLiquidacionDateChange = (date, fieldName) => {
    setLiquidacionFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleLiquidacionChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLiquidacionFormData((prevData) => {
      if (name === "tasa") {
        return { ...prevData, tasa: value, tasa_label: value };
      }
      return { ...prevData, [name]: type === "checkbox" ? checked : value };
    });
  };

  const handleReset = () => {
    setLiquidacionFormData({
      concepto: "",
      tasa: "",
      capital: "",
      fecha_origen: "",
      fecha_liquidacion: "",
      tasa_label: "",
      imprimir: false,
    });
    setResultado(null);
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
    setModalMessage("Calculando liquidación...");

    const payload = {
      concepto: liquidacionFormData.concepto,
      capital: liquidacionFormData.capital,
      tasa: liquidacionFormData.tasa,
      tasa_label: liquidacionFormData.tasa_label,
      fecha_origen: formatDate(liquidacionFormData.fecha_origen),
      fecha_liquidacion: formatDate(liquidacionFormData.fecha_liquidacion),
      imprimir: liquidacionFormData.imprimir,
      descargar_pdf: false,
    };

    try {
      const data = await calcularLiquidacion(payload);
      setResultado(data);
      setModalVisible(false);
      setModalMessage("");
    } catch (err) {
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
      {/* Header */}
      <header className="relative min-h-[60vh] 2xl:h-[70vh] md:h-[80vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>

        <ResponsiveNav />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4 pt-40 md:pt-0">
          <h5 className="2xl:text-2xl md:text-xl font-normal mb-2">
            Liquidaciones
          </h5>
          <h1 className="2xl:text-7xl md:text-5xl font-normal mb-6">
            Formularios
          </h1>
        </div>
      </header>

      {/* Formulario + Resultado en cuadros separados */}
      <section className="relative z-20 md:-mt-36 -mt-16 flex justify-center pb-20 px-4 sm:px-6">
        <div className="w-full md:w-4/5 max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-primary mb-8 bg-white py-4 rounded-lg shadow-sm">
            Liquidaciones
          </h2>

          <div
            className={`grid items-start gap-8 ${resultado ? "md:grid-cols-2" : "grid-cols-1"
              }`}
          >
            {/* Card del formulario (igual que antes, pero en su propio cuadro) */}
            <div className="bg-white py-10 md:py-12 px-6 sm:px-8 lg:px-10 rounded-lg shadow-lg">
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
                      value={liquidacionFormData.concepto}
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
                      value={liquidacionFormData.tasa}
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
                          handleLiquidacionDateChange(
                            date,
                            "fecha_liquidacion"
                          )
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
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-4 font-lato mt-6">
                    <button
                      type="reset"
                      className="px-4 py-2 border-gray-200 border-2 text-gray-700 rounded-lg w-full sm:w-auto"
                    >
                      Reiniciar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary text-white rounded-lg w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Calculando..." : "Calcular"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Card separado del resultado */}
            {resultado && <LiquidacionResultado data={resultado} />}
          </div>
        </div>
      </section>

      {/* Podés dejar el resto como lo tenías */}
      <Footer />

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <span>{modalMessage}</span>

            {!isLoading && modalMessage && (
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
    </div>
  );
};

export default Liquidaciones;
