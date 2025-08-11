import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState("Validando el pago...");
  const [comprobanteUrl, setComprobanteUrl] = useState(null);

  useEffect(() => {
    const preferenceId = searchParams.get("preference_id");

    const confirmarPago = async () => {
      if (!preferenceId) {
        setMensaje("Error: No se pudo identificar la operación.");
        return;
      }

      try {
        // Paso 1: Chequear el estado del pago y obtener el payment_id
        const estadoRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/forms/payment_status/${preferenceId}`);
        const estadoData = await estadoRes.json();

        if (estadoData.status !== "approved") {
          setMensaje("El pago no fue aprobado aún. Esperá unos segundos e intentá nuevamente.");
          return;
        }

        // Paso 2: Confirmar el recibo en backend
        const uuid = estadoData.uuid || searchParams.get("external_reference");
        const paymentId = estadoData.payment_id;

        const confirmRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/forms/confirm_receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid, payment_id: paymentId })
        });

        const confirmData = await confirmRes.json();
        if (!confirmRes.ok) throw new Error(confirmData.error || "Error al guardar comprobante");

        // Paso 3: Generar link para descarga
        const url = `${process.env.REACT_APP_BACKEND_URL}/forms/download_receipt?derecho_fijo_uuid=${uuid}`;
        setComprobanteUrl(url);
        setMensaje("¡Pago confirmado exitosamente!");
      } catch (err) {
        console.error("❌ Error en el flujo de confirmación:", err);
        setMensaje("Ocurrió un error al procesar tu pago. Si el dinero fue debitado, contactanos.");
      }
    };

    confirmarPago();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-lato">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">{mensaje}</h2>

        {comprobanteUrl && (
          <a
            href={comprobanteUrl}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition duration-200"
            download
          >
            Descargar comprobante
          </a>
        )}

        <div className="mt-6">
          <a href="/" className="text-sm text-gray-500 hover:underline">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
