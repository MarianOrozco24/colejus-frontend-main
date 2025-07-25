import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { postDerechoFijo } from "../api/postDerechoFijo";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/derechofijo.css";

registerLocale("es", es);

const DerechoFijo = () => {
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [preferenceId, setPreferenceId] = useState(null);
  const [derechoFijoId, setDerechoFijoId] = useState(null);
  const [valorDerechoFijo, setValorDerechoFijo] = useState(null);


  const [formData, setFormData] = useState({
    lugar: "",
    fecha: "",
    juicio_n: "",
    caratula: "",
    juzgado: "",
    fecha_inicio: "",
    tasa_justicia: "",
    parte: "",
    total_depositado: "",
    derecho_fijo_5pc: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = (e) => {
    setFormData({
      lugar: "",
      fecha: "",
      juicio_n: "",
      caratula: "",
      juzgado: "",
      fecha_inicio: "",
      tasa_justicia: "",
      parte: "",
      total_depositado: "",
      derecho_fijo_5pc: "",
    });
  };

  const handleSubmit = (e) => {
    // Manejamos el valor de ingreso de los valores
    e.preventDefault();
    if (valorDerechoFijo && Number(formData.total_depositado) < valorDerechoFijo) {
  setModalMessage(`El valor mínimo para ingresar es de $${valorDerechoFijo}`);
  setModalVisible(true);
  return;
}
// ############### Se comenta porque segun NPM se llama y no se esta usando #############//

    // Armá el payload con los números correctamente casteados
    // const payload = {
    //   ...formData,
    //   tasa_justicia: Number(formData.tasa_justicia),
    //   total_depositado: Number(formData.total_depositado),
    //   derecho_fijo_5pc: Number(formData.tasa_justicia) * 0.05,
    // };

// EN CASO DE ERROR DESCOMENTAR //

    postDerechoFijo(formData)
      .then((data) => {
        if (data.qr_code_base64) {
        setPreferenceId(data.preference_id);
        setDerechoFijoId(data.uuid);
        setModalMessage(
          <div className="text-center font-lato">
            <h2 className="text-2xl font-semibold text-primary mb-4">¡Pago generado con éxito!</h2>

            <p className="text-base text-gray-700 mb-2">Escaneá el siguiente código QR para pagar con Mercado Pago:</p>
            
            <img
              src={`data:image/png;base64,${data.qr_code_base64}`}
              alt="QR Code"
              className="mx-auto mb-4 rounded shadow-md"
              style={{ width: "220px", height: "220px" }}
            />

            <p className="text-base text-gray-700 mb-2">¿Preferís pagar con tarjeta?</p>
            <button
              onClick={() => window.open(data.payment_url, "_blank")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-200 shadow"
            >
              Pagar con tarjeta
            </button>

            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Estado actual del pago: <span className="font-semibold text-black">{paymentStatus}</span>
              </p>
            </div>
          </div>
        );

        setModalVisible(true);
        } 
        else 
          {
          setModalMessage("Error en el creado del pago");
          setModalVisible(true);
        }
      })
      .catch((error) => {
        setModalMessage(`Error: ${error.message || error}`);
        setModalVisible(true);
      });
  };

  const downloadPDF = async (uuid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/forms/download_receipt?derecho_fijo_uuid=${uuid}`
      );
      if (!response.ok) throw new Error("Error downloading PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `derecho_fijo_${uuid}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error al descargar el comprobante");
    }
  };

  useEffect(() => {
  const fetchValorDerechoFijo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/forms/get_price_derecho_fijo`);
      const result = await response.json();
      console.log("💡 Valor recibido:", result);

      const valor = result.data?.[0]?.value;

      if (response.ok && valor) {
        setValorDerechoFijo(valor);
      }
    } catch (error) {
      console.error("❌ Error trayendo derecho fijo:", error);
    }
  };

  fetchValorDerechoFijo();
}, []);



  useEffect(() => {
    let interval;
    if (preferenceId) {
      // console.log("Starting payment check for preferenceId:", preferenceId);
      interval = setInterval(async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/forms/payment_status/${preferenceId}`
          );
          const data = await response.json();
          // console.log("Payment status response:", data);

          if (data.status === "approved") {
            // console.log("Payment approved!");
            setPaymentStatus("approved");
            clearInterval(interval);

            await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/forms/confirm_receipt`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  uuid: derechoFijoId,
                  payment_id: preferenceId,
                }),
              }
            );

            // Update modal with download button
            setModalMessage((prevMessage) => (
              <div>
                <h2 className="text-xl font-semibold mb-4 font-lato">
                  Pago creado exitosamente
                </h2>
                <p className="text-green-600 font-semibold mb-4">
                  ¡Pago completado!
                </p>
                <button
                  onClick={() => downloadPDF(derechoFijoId)}
                  className="bg-secondary text-white px-4 py-2 rounded-lg"
                >
                  Descargar Comprobante
                </button>
              </div>
            ));
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 3000);
    }

    return () => {
      if (interval) {
        // console.log("Clearing payment check interval");
        clearInterval(interval);
      }
    };
  }, [preferenceId, derechoFijoId]);

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
            Derecho fijo
          </h5>
          <h1
            className="2xl:text-7xl md:text-5xl font-normal mb-6"
            style={{ lineHeight: "1.5" }}
          >
            Formulario de pago
          </h1>
        </div>
      </header>

      {/* The Form Section */}
      <section className="relative z-20 -mt-36 flex justify-center pb-20">
        {" "}
        {/* Negative margin for overlap */}
        <div className="bg-white py-20 px-32 rounded-lg shadow-lg 2xl:w-full 2xl:max-w-screen-2xl md:w-4/5">
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Lugar
                </label>
                <select
                  name="lugar"
                  className="w-full border-b border-gray-300 p-3 pr-8 focus:outline-none placeholder-gray-500 font-lato appearance-none bg-transparent"
                  value={formData.lugar}
                  onChange={handleChange}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem",
                  }}
                >
                  <option value="" disabled>
                    Seleccione lugar correspondiente
                  </option>
                  <option value="Gral. Alvear">Gral. Alvear</option>
                  <option value="Malargüe">Malargüe</option>
                  <option value="San Rafael">San Rafael</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Fecha inicio
                </label>
                <div className="relative w-full">
                  <DatePicker
                    selected={formData.fecha_inicio}
                    onChange={(date) => handleDateChange(date, "fecha_inicio")}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Fecha
                </label>
                <div className="relative w-full">
                  <DatePicker
                    selected={formData.fecha}
                    onChange={(date) => handleDateChange(date, "fecha")}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Tasa de justicia
                </label>
                <div className="flex items-center border-b border-gray-300">
                  <span className="text-gray-500 px-2">$</span>
                  <input
                    type="number"
                    name="tasa_justicia"
                    placeholder="0"
                    className="w-full p-3 focus:outline-none placeholder-gray-500 font-lato"
                    value={formData.tasa_justicia}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Juicio N
                </label>
                <input
                  type="number"
                  name="juicio_n"
                  placeholder="Complete con el número de juicio"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  value={formData.juicio_n}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Derecho fijo 5%
                </label>
                <div className="flex items-center border-b border-gray-300 bg-gray-100">
                  <span className="text-gray-500 px-2">$</span>
                  <input
                    disabled
                    type="text"
                    name="derecho_fijo_5pc"
                    className="w-full p-3 disabled:bg-transparent focus:outline-none placeholder-gray-500 font-lato"
                    value={Math.floor(formData.tasa_justicia * 0.05)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Carátula
                </label>
                <input
                  type="text"
                  name="caratula"
                  placeholder="Complete con carátula"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  value={formData.caratula}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Parte
                </label>
                <select
                  name="parte"
                  className="w-full border-b border-gray-300 p-3 pr-8 focus:outline-none placeholder-gray-500 font-lato appearance-none bg-transparent"
                  value={formData.parte}
                  onChange={handleChange}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem",
                  }}
                >
                  <option value="" disabled>
                    Seleccione parte correspondiente
                  </option>
                  <option value="Actor">Actor</option>
                  <option value="Demandado">Demandado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Juzgado
                </label>
                <input
                  type="text"
                  name="juzgado"
                  placeholder="Seleccione juzgado correspondiente"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  value={formData.juzgado}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">
                  Total depositado
                </label>
                <div className="flex items-center border-b border-gray-300">
                  <span className="text-gray-500 px-2">$</span>
                  <input
                    type="number"
                    name="total_depositado"
                    placeholder={valorDerechoFijo ? `$${valorDerechoFijo}` : "Ej: 12000"}
                    className="w-full p-3 focus:outline-none placeholder-gray-500 font-lato"
                    value={formData.total_depositado}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 font-semibold font-lato">
                  Ingreso mínimo ${valorDerechoFijo || "No se encontro un valor"}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 font-lato">
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
                Imprimir
              </button>
            </div>
          </form>
          {/* <h5 className="2xl:text-2xl md:text-xl font-normal mb-2" style={{ lineHeight: '1.5' }}>
                        Actualmente esta función se encuentra en desarrollo, disculpe las molestias.
                    </h5> */}
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
                  href="#liquidaciones"
                  className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left"
                >
                  Liquidaciones
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
            {modalMessage}
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded font-lato"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DerechoFijo;
