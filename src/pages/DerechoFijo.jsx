import React, { useEffect, useState } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import { postDerechoFijo, postDerechoFijoBCM, postDerechoFijoPresencial, postDerechoFijoBNA } from "../api/postDerechoFijo";
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
  const [bcmPaymentId, setBcmPaymentId] = useState(null);

  // Side Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState("options"); // "options", "loading", "qr", "download", "success", "error"
  const [drawerLoadingText, setDrawerLoadingText] = useState("");
  const [drawerErrorText, setDrawerErrorText] = useState("");
  const [qrCodeSrc, setQrCodeSrc] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");

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

    // Validacion de campos obligatorios
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

    // Validacion rapida de email
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailOk) {
      setModalMessage("Revisá el correo electrónico: el formato no es válido.");
      setModalVisible(true);
      return;
    }

    // Validacion de monto minimo
    if (valorDerechoFijo && Number(formData.total_depositado) < valorDerechoFijo) {
      setModalMessage(`El valor mínimo para ingresar es de $${valorDerechoFijo}`);
      setModalVisible(true);
      return;
    }

    // Abrir drawer con opciones de pago
    setDrawerStep("options");
    setDrawerOpen(true);
  };

  const handlePago = async (tipo) => {
    try {
      setDrawerLoadingText(
        tipo === "bna_presencial"
          ? "Generando boleta BNA..."
          : tipo === "bcm_presencial"
            ? "Generando boleta Bolsa de Comercio..."
            : "Generando pago..."
      );
      setDrawerStep("loading");

      // Pago con tarjeta (Mercado Pago Checkout)
      if (tipo === "tarjeta") {
        const data = await postDerechoFijo(formData, true);
        setPreferenceId(data?.preference_id || null);
        setDerechoFijoId(data?.uuid || null);

        const checkoutUrl = data?.init_point || data?.payment_url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          setDrawerErrorText("No se pudo redireccionar al checkout.");
          setDrawerStep("error");
        }
        return;
      }

      // Pago con MP QR
      if (tipo === "mp_qr") {
        const data = await postDerechoFijo(formData, false);
        setPreferenceId(data?.preference_id || null);
        setDerechoFijoId(data?.uuid || null);

        const src = normalizeQrSrc(data?.qr_code_base64);
        if (!src) {
          setDrawerErrorText("No se recibió la imagen del QR de Mercado Pago.");
          setDrawerStep("error");
          return;
        }

        setQrCodeSrc(src);
        setDrawerStep("qr");
        return;
      }

      // Pago con QR Bolsa de Comercio
      if (tipo === "bcm_qr") {
        const data = await postDerechoFijoBCM(formData);
        setPreferenceId(data?.preference_id || null);
        setDerechoFijoId(data?.uuid || null);
        setBcmPaymentId(data?.payment_id || null);

        const src = normalizeQrSrc(data?.qr_image_base64 || data?.qr_code_base64);
        if (!src) {
          setDrawerErrorText("No se recibió la imagen del QR de la Bolsa.");
          setDrawerStep("error");
          return;
        }

        setQrCodeSrc(src);
        setDrawerStep("qr");
        return;
      }

      // Pago presencial Bolsa de Comercio
      if (tipo === "bcm_presencial") {
        const result = await postDerechoFijoPresencial(formData);

        if (result?.ok) {
          setDownloadFilename(result.filename);
          setDrawerStep("download");
        } else {
          setDrawerErrorText("No se pudo generar la boleta para pago presencial.");
          setDrawerStep("error");
        }
        return;
      }

      // Pago presencial Banco Nacion
      if (tipo === "bna_presencial") {
        const result = await postDerechoFijoBNA(formData);

        if (result?.ok) {
          setDownloadFilename(result.filename);
          setDrawerStep("download");
        } else {
          setDrawerErrorText("No se pudo generar la boleta BNA.");
          setDrawerStep("error");
        }
        return;
      }

    } catch (error) {
      setDrawerErrorText(error.message || String(error));
      setDrawerStep("error");
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
        const valor = result.data;

        if (response.ok && valor) {
          setValorDerechoFijo(valor);
        }
      } catch (error) {
        console.error("Error trayendo derecho fijo:", error);
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

            setDrawerStep("success");
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 3000);
    }
    return () => interval && clearInterval(interval);
  }, [preferenceId, derechoFijoId]);

  // Polling para BCM por payment_id
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
          setDrawerStep("success");
        }
      } catch (e) {
        // opcional
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [bcmPaymentId, derechoFijoId]);

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[60vh] 2xl:h-[70vh] md:h-[80vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div className="absolute inset-0 opacity-60 z-0" style={{ backgroundColor: "#06092E" }}></div>
        <ResponsiveNav />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4 pt-40 md:pt-0">
          <h5 className="2xl:text-2xl md:text-xl font-normal mb-2" style={{ lineHeight: "1.5" }}>
            Derecho fijo
          </h5>
          <h1 className="2xl:text-7xl md:text-5xl font-normal mb-6" style={{ lineHeight: "1.5" }}>
            Formulario de pago
          </h1>
        </div>
      </header>

      {/* Formulario */}
      <section className="relative z-20 md:-mt-36 -mt-16 flex justify-center pb-20 px-4 sm:px-6">
        <div className="bg-white py-10 md:py-16 px-6 sm:px-10 lg:px-20 xl:px-32 rounded-lg shadow-lg w-full md:w-4/5 max-w-5xl">
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
                  El comprobante de pago se enviará a este correo
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

            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 font-lato">
              <button type="reset" className="px-4 py-2 border-gray-200 border-2 text-gray-700 rounded-lg w-full sm:w-auto">
                Reiniciar
              </button>
              <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-lg w-full sm:w-auto">
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
            <button onClick={handleCloseModal} className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded font-lato">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Side Drawer Component */}
      {drawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-50 overlay-fade-in"
            onClick={() => {
              if (drawerStep !== "loading") {
                setDrawerOpen(false);
              }
            }}
          />

          {/* Drawer Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col drawer-open font-lato">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Detalle de Pago</h2>
              <button
                onClick={() => {
                  if (drawerStep !== "loading") {
                    setDrawerOpen(false);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1.5 sm:p-2 rounded-full hover:bg-gray-50 focus:outline-none"
                aria-label="Cerrar panel"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 drawer-scrollbar">
              {drawerStep === "options" && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 sm:mb-6 border border-gray-100">
                    <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Total a pagar</span>
                    <span className="text-xl sm:text-2xl font-black text-primary">
                      ${Number(formData.total_depositado).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    Seleccioná una de las opciones para realizar el pago:
                  </p>

                  <div className="flex flex-col space-y-2 sm:space-y-3">
                    <button
                      onClick={() => handlePago("mp_qr")}
                      className="w-full text-left bg-white border border-gray-200 hover:border-indigo-500 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md flex items-center space-x-3 sm:space-x-4 focus:outline-none group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl flex items-center justify-center grayscale-emoji text-xl sm:text-2xl">
                        🔳
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-150">
                          QR Mercado Pago
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                          Pagá al instante escaneando el código QR.
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePago("tarjeta")}
                      className="w-full text-left bg-white border border-gray-200 hover:border-green-500 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md flex items-center space-x-3 sm:space-x-4 focus:outline-none group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl flex items-center justify-center grayscale-emoji text-xl sm:text-2xl">
                        💳
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-150">
                          Pagar con tarjeta
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                          Débito o crédito a través de Mercado Pago.
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePago("bcm_qr")}
                      className="w-full text-left bg-white border border-gray-200 hover:border-emerald-500 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md flex items-center space-x-3 sm:space-x-4 focus:outline-none group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl flex items-center justify-center grayscale-emoji text-xl sm:text-2xl">
                        🔳
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-150">
                          QR Bolsa de Comercio
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                          Pagá escaneando con la app de la Bolsa de Comercio.
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePago("bcm_presencial")}
                      className="w-full text-left bg-white border border-gray-200 hover:border-emerald-500 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md flex items-center space-x-3 sm:space-x-4 focus:outline-none group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl flex items-center justify-center grayscale-emoji text-xl sm:text-2xl">
                        📄
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-150">
                          Boleta Bolsa de Comercio
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                          Generá la boleta física para pago presencial.
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePago("bna_presencial")}
                      className="w-full text-left bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md flex items-center space-x-3 sm:space-x-4 focus:outline-none group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl flex items-center justify-center grayscale-emoji text-xl sm:text-2xl">
                        📄
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-150">
                          Boleta Banco Nación (BNA)
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                          Generá la boleta BNA para realizar depósito presencial.
                        </p>
                      </div>
                      <div className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {drawerStep === "loading" && (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin-custom mb-4 sm:mb-6"></div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Procesando solicitud</h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-xs">{drawerLoadingText}</p>
                </div>
              )}

              {drawerStep === "qr" && (
                <div className="h-full flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-lg sm:text-xl mb-4 grayscale-emoji">
                    🔳
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Código QR Generado</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Escaneá el código para realizar el pago.</p>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-inner flex justify-center items-center mb-4 sm:mb-6">
                    <img src={qrCodeSrc} alt="Código QR de Pago" className="w-48 h-48 sm:w-56 sm:h-56 shadow-md rounded-xl bg-white p-2.5 sm:p-3 border border-gray-100" />
                  </div>

                  <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 text-xs font-semibold mb-4 sm:mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <span>Esperando confirmación del pago...</span>
                  </div>

                  <button
                    onClick={() => setDrawerStep("options")}
                    className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition duration-150 text-sm w-full"
                  >
                    Volver
                  </button>
                </div>
              )}

              {drawerStep === "download" && (
                <div className="h-full flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-4 grayscale-emoji">
                    📄
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">¡Boleta generada con éxito!</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">El archivo se ha descargado a tu dispositivo.</p>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 w-full mb-4 sm:mb-6 text-left">
                    <span className="text-xs text-gray-400 block font-semibold">Nombre del archivo</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-700 break-all">{downloadFilename}</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-6 sm:mb-8">
                    Presentala impresa en la sucursal de pago correspondiente para abonar tu Derecho Fijo.
                  </p>

                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="py-2.5 sm:py-3 bg-secondary hover:bg-opacity-95 text-white font-bold rounded-xl transition duration-150 text-sm w-full"
                  >
                    Entendido
                  </button>
                </div>
              )}

              {drawerStep === "success" && (
                <div className="h-full flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-4 grayscale-emoji">
                    ✔️
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">¡Pago aprobado con éxito!</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Tu pago ha sido acreditado correctamente. Ya podés descargar el comprobante oficial.</p>

                  <button
                    onClick={() => downloadPDF(derechoFijoId)}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-bold shadow-md hover:shadow-lg transition duration-150 mb-4 sm:mb-6 text-sm sm:text-base"
                  >
                    <span className="grayscale-emoji text-xl">📄</span>
                    <span>Descargar Comprobante</span>
                  </button>

                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      window.location.reload();
                    }}
                    className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition duration-150 text-sm w-full"
                  >
                    Cerrar ventana
                  </button>
                </div>
              )}

              {drawerStep === "error" && (
                <div className="h-full flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-4 grayscale-emoji">
                    ❌
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Ocurrió un error</h3>
                  <p className="text-xs sm:text-sm text-red-500 mb-4 sm:mb-6 font-medium">{drawerErrorText}</p>

                  <p className="text-xs text-gray-400 mb-6 sm:mb-8">
                    Por favor, verificá la conexión e intentalo nuevamente.
                  </p>

                  <button
                    onClick={() => setDrawerStep("options")}
                    className="py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition duration-150 text-sm w-full"
                  >
                    Volver a intentar
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default DerechoFijo;
