import { useEffect, useState } from "react";
import { FaEye, FaDownload } from "react-icons/fa";

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1) filtrado sobre el array completo
  const recibosFiltrados = recibos.filter(recibo =>
    recibo.caratula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recibo.fecha_pago.includes(searchTerm)
  );

  // 2) total de páginas sobre el filtrado
  const totalPages = Math.ceil(recibosFiltrados.length / itemsPerPage);

  // 3) índices de slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 4) array final paginado
  const recibosPaginados = recibosFiltrados.slice(startIndex, endIndex);

  const fetchReceipts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/forms/receipts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await res.json();
      setRecibos(data);
    } catch (error) {
      console.error("❌ Error al cargar recibos:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (uuid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/forms/download_receipt?receipt_uuid=${uuid}`
      );

      if (!response.ok) throw new Error("No se pudo descargar el recibo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recibo_${uuid}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al descargar PDF:", error);
      alert("No se pudo descargar el recibo");
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  return (
    <div className="p-6">
      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por carátula o fecha..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset al primer página
          }}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Historial de <span className="text-secondary">Recibos</span>
        </h1>
      </div>
      {loading ? (
        <p className="text-center text-gray-400">Cargando recibos...</p>
      ) : !recibos || recibos.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay recibos disponibles aún
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-4 text-sm font-medium text-gray-500 w-3/12">
                  Fecha
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 w-3/12">
                  Caratula
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 w-3/12">
                  Monto
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">
                  Estado
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 text-center w-2/12">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {recibosPaginados.map((recibo) => (
                <tr key={recibo.uuid} className="border-b">
                  <td className="p-4 text-sm text-gray-500">
                    {recibo.fecha_pago}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {recibo.caratula}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    ${recibo.total_depositado.toFixed(2)}
                  </td>
                  <td className="p-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${recibo.status === "Pagado"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {recibo.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center space-x-4">
                    <button
                      className="text-gray-500 hover:text-primary"
                      onClick={() => downloadPDF(recibo.uuid)}
                    >
                      <FaDownload size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}{" "}
      {/* PAGINADO FANCY 👇 */}
      {recibos.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-2 py-1 rounded bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {"<"}
            </button>

            {(() => {
              let pages = [];
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, currentPage + 2);

              if (currentPage <= 3) {
                endPage = Math.min(totalPages, 5);
              } else if (currentPage > totalPages - 3) {
                startPage = Math.max(1, totalPages - 4);
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-2 py-1 rounded ${currentPage === i
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                      }`}
                  >
                    {i}
                  </button>
                );
              }

              return pages;
            })()}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-2 py-1 rounded bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
