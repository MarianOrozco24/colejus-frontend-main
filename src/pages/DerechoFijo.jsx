import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { postDerechoFijo, postDerechoFijoBCM } from "../api/postDerechoFijo";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [bcmPaymentId, setBcmPaymentId] = useState(null); // NUEVO: payment_id devuelto por QR BCM

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
    email: "", // 👈 NUEVO
  });

  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: date }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // para email, recortamos espacios
    const v = name === "email" ? value.trim() : value;
    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const handleReset = () => {
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
      email: "", // 👈 NUEVO
    });
    sessionStorage.removeItem("ultimoDerechoFijoForm");
  };

  // Normaliza base64 con o sin prefijo
  const normalizeQrSrc = (value) => {
    if (!value) return null;
    return value.startsWith("data:image")
      ? value
      : `data:image/png;base64,${value}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validación de campos obligatorios (agregamos email)
    const requiredFields = [
      "lugar",
      "fecha_inicio",
      "fecha",
      "tasa_justicia",
      "juicio_n",
      "caratula",
      "parte",
      "juzgado",
      "total_depositado",
      "email",
    ];
    for (let field of requiredFields) {
      const v = formData[field];
      if (v === "" || v === null || v === undefined) {
        setModalMessage("Por favor, completá todos los campos antes de continuar.");
        setModalVisible(true);
        return;
      }
    }

    // Validación rápida de email
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailOk) {
      setModalMessage("Revisá el correo electrónico: el formato no es válido.");
      setModalVisible(true);
      return;
    }

    // ✅ Validación de monto mínimo
    if (valorDerechoFijo && Number(formData.total_depositado) < valorDerechoFijo) {
      setModalMessage(`El valor mínimo para ingresar es de $${valorDerechoFijo}`);
      setModalVisible(true);
      return;
    }

    // ✅ Mostrar opciones de pago (3 botones)
    setModalMessage(
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4 font-lato">¿Cómo querés pagar?</h2>
        <p className="text-gray-700 mb-6 font-lato">
          Seleccioná una de las opciones para continuar con el pago.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handlePago("mp_qr")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-200 shadow-sm"
          >
            🟦 QR Mercado Pago
          </button>
          <button
            onClick={() => handlePago("tarjeta")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-200 shadow-sm"
          >
            💳 Pagar con tarjeta
          </button>
          {/* <button
            onClick={() => handlePago("bcm_qr")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-200 shadow-sm"
          >
            🟩 QR Bolsa de Comercio
          </button> */}
        </div>
      </div>
    );
    setModalVisible(true);
  };

  const handlePago = async (tipo) => {
    try {
      setModalMessage("⏳ Generando pago...");
      setModalVisible(true);

      if (tipo === "tarjeta") {
        const data = await postDerechoFijo(formData, true);
        setPreferenceId(data?.preference_id || null);
        setDerechoFijoId(data?.uuid || null);

        const checkoutUrl = data?.init_point || data?.payment_url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          setModalMessage("❌ No se pudo redireccionar al checkout.");
        }
        return;
      }

      if (tipo === "mp_qr") {
        const data = await postDerechoFijo(formData, false);
        setPreferenceId(data?.preference_id || null);
        setDerechoFijoId(data?.uuid || null);

        const src = normalizeQrSrc(data?.qr_code_base64);
        if (!src) {
          setModalMessage("❌ No se recibió la imagen del QR de Mercado Pago.");
          return;
        }

        setModalMessage(
          <div className="text-center font-lato">
            <h2 className="text-2xl font-semibold text-primary mb-4">¡QR generado!</h2>
            <p className="text-base text-gray-700 mb-3">Escaneá el código para pagar con Mercado Pago.</p>
            <img src={src} alt="QR MP" className="mx-auto mb-4 rounded shadow-md" style={{ width: 240, height: 240 }} />
            <div className="mt-4 text-sm text-gray-500">
              Estado del pago: <span className="font-semibold text-black">{paymentStatus}</span>
            </div>
          </div>
        );
        return;
      }

      if (tipo === "bcm_qr") {
        const data = await postDerechoFijoBCM(formData);
        setPreferenceId(data?.preference_id || null);
        setDerechoFijoId(data?.uuid || null);
        setBcmPaymentId(data?.payment_id || null); // NUEVO

        const src = normalizeQrSrc(data?.qr_image_base64 || data?.qr_code_base64);
        if (!src) {
          setModalMessage("❌ No se recibió la imagen del QR de la Bolsa.");
          return;
        }

        setModalMessage(
          <div className="text-center font-lato">
            <h2 className="text-2xl font-semibold text-primary mb-4">¡QR generado!</h2>
            <p className="text-base text-gray-700 mb-3">Escaneá el código para pagar con la Bolsa de Comercio.</p>
            <img src={src} alt="QR Bolsa de Comercio" className="mx-auto mb-4 rounded shadow-md" style={{ width: 240, height: 240 }} />
            <div className="mt-4 text-sm text-gray-500">
              Estado del pago: <span className="font-semibold text-black">{paymentStatus}</span>
            </div>
          </div>
        );
        return;
      }
    } catch (error) {
      setModalMessage(`❌ Error al generar el pago: ${error.message || error}`);
    }
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
      setTimeout(() => window.location.reload(), 800);
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
        const valor = result.data?.[0]?.value;
        if (response.ok && valor) setValorDerechoFijo(valor);
      } catch (error) {
        console.error("❌ Error trayendo derecho fijo:", error);
      }
    };
    fetchValorDerechoFijo();
  }, []);

  // Polling (solo para MP con preferenceId)
  useEffect(() => {
    let interval;
    if (preferenceId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/forms/payment_status/${preferenceId}`
          );
          const data = await response.json();

          if (data.status === "approved") {
            setPaymentStatus("approved");
            clearInterval(interval);

            await fetch(`${process.env.REACT_APP_BACKEND_URL}/forms/confirm_receipt`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uuid: derechoFijoId, payment_id: preferenceId }),
            });

            setModalMessage(
              <div className="text-center font-lato">
                <h2 className="text-xl font-semibold mb-4">Pago creado exitosamente</h2>
                <p className="text-green-600 font-semibold mb-4">¡Pago completado!</p>
                <button
                  onClick={() => downloadPDF(derechoFijoId)}
                  className="bg-secondary text-white px-4 py-2 rounded-lg"
                >
                  Descargar Comprobante
                </button>
              </div>
            );
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 3000);
    }
    return () => interval && clearInterval(interval);
  }, [preferenceId, derechoFijoId]);

  // 🔁 Polling para BCM por payment_id
  useEffect(() => {
    if (!bcmPaymentId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/forms/receipt-status?payment_id=${encodeURIComponent(bcmPaymentId)}`
        );
        if (!res.ok) return;
        const j = await res.json();
        const paid = String(j?.status || "").toLowerCase().startsWith("paga");
        if (paid) {
          setPaymentStatus("approved");
          clearInterval(interval);
          setModalMessage(
            <div className="text-center font-lato">
              <h2 className="text-xl font-semibold mb-4">Pago aprobado</h2>
              <button
                onClick={() => downloadPDF(derechoFijoId)}
                className="bg-secondary text-white px-4 py-2 rounded-lg"
              >
                Descargar Comprobante
              </button>
            </div>
          );
        }
      } catch (e) {
        // opcional: log
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [bcmPaymentId, derechoFijoId]);

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative 2xl:h-[70vh] md:h-[80vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div className="absolute inset-0 opacity-60 z-0" style={{ backgroundColor: "#06092E" }}></div>
        <NavBar />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
          <h5 className="2xl:text-2xl md:text-xl font-normal mb-2" style={{ lineHeight: "1.5" }}>
            Derecho fijo
          </h5>
          <h1 className="2xl:text-7xl md:text-5xl font-normal mb-6" style={{ lineHeight: "1.5" }}>
            Formulario de pago
          </h1>
        </div>
      </header>

      {/* Formulario */}
      <section className="relative z-20 -mt-36 flex justify-center pb-20">
        <div className="bg-white py-20 px-32 rounded-lg shadow-lg 2xl:w-full 2xl:max-w-screen-2xl md:w-4/5">
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">Lugar</label>
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
                  <option value="" disabled>Seleccione lugar correspondiente</option>
                  <option value="Gral. Alvear">Gral. Alvear</option>
                  <option value="Malargüe">Malargüe</option>
                  <option value="San Rafael">San Rafael</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">Fecha inicio</label>
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
                <label className="block font-semibold text-gray-700 font-bakersville">Fecha</label>
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
                <label className="block font-semibold text-gray-700 font-bakersville">Tasa de justicia</label>
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
                <label className="block font-semibold text-gray-700 font-bakersville">Juicio N</label>
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
                <label className="block font-semibold text-gray-700 font-bakersville">Derecho fijo 5%</label>
                <div className="flex items-center border-b border-gray-300 bg-gray-100">
                  <span className="text-gray-500 px-2">$</span>
                  <input
                    disabled
                    type="text"
                    name="derecho_fijo_5pc"
                    className="w-full p-3 disabled:bg-transparent focus:outline-none placeholder-gray-500 font-lato"
                    value={Math.floor(formData.tasa_justicia * 0.05)}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">Carátula</label>
                <input
                  type="text"
                  name="caratula"
                  placeholder="Complete con carátula"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  value={formData.caratula}
                  onChange={handleChange}
                />
              </div>

              {/* 👇 NUEVO CAMPO: CORREO ELECTRÓNICO */}
              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  className="w-full border-b border-gray-300 p-3 focus:outline-none placeholder-gray-500 font-lato"
                  value={formData.email}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1 font-lato">
                  Recibirás el comprobante de pago en este correo.
                </p>
              </div>
              {/* 👆 FIN NUEVO CAMPO */}

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">Parte</label>
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
                  <option value="" disabled>Seleccione parte correspondiente</option>
                  <option value="Actor">Actor</option>
                  <option value="Demandado">Demandado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 font-bakersville">Juzgado</label>
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
                <label className="block font-semibold text-gray-700 font-bakersville">Total depositado</label>
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
                  Ingreso mínimo ${valorDerechoFijo || "No se encontró un valor"}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 font-lato">
              <button type="reset" className="px-4 py-2 border-gray-200 border-2 text-gray-700 rounded-lg">
                Reiniciar
              </button>
              <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-lg">
                Imprimir
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Links de interés (igual que antes) */}
      <section className="mt-9 pb-24">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Otras herramientas</h3>
              <div className="grid grid-cols-2 gap-8">
                <a href="#liquidaciones" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left">Liquidaciones</a>
                <a href="#caja-forense" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left">Caja forense</a>
                <a href="#edictos" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary text-left">Edictos</a>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Links de interés</h3>
              <div className="grid grid-cols-2 gap-8">
                <a href="#poder-judicial-mza" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary">Poder judicial Mza</a>
                <a href="#listas-diarias" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary">Listas diarias</a>
                <a href="#notificaciones" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary">Notificaciones</a>
                <a href="#atm" className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary">ATM</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            {modalMessage}
            <button onClick={() => setModalVisible(false)} className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded font-lato">
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
