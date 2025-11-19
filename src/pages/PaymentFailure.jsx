
const PaymentFailure = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 font-lato">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Pago rechazado</h2>
        <p className="text-gray-700 mb-4">
          El pago fue rechazado por la entidad emisora o cancelado. Por favor,
          verificá los datos de tu tarjeta o intentá con otro medio.
        </p>
        <a
          href="/derecho-fijo"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-200"
        >
          Volver al formulario
        </a>
      </div>
    </div>
  );
};

export default PaymentFailure;
