import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";



// --- UI mínimos locales --
function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border shadow-sm 
      bg-gradient-to-br from-white to-indigo-50/40 
      dark:from-neutral-1200 dark:to-neutral-200 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ className = "", children }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
function Button({ className = "", variant = "solid", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-100 dark:border-neutral-700 bg-transparent hover:bg-gray-50 dark:hover:bg-neutral-800"
      : "bg-indigo-600 text-white hover:bg-indigo-700";
  return <button className={`px-3 py-2 rounded-xl text-sm transition ${base} ${className}`} {...props} />;
}
function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-100 dark:border-neutral-700 ${props.className || ""}`}
    />
  );
}
function Icon({ name, className = "w-4 h-4" }) {
  // íconos mínimos en SVG inline
  const icons = {
    refresh: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M20 12a8 8 0 10-3 6.3" />
        <path d="M20 4v6h-6" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
    ),
    filter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
      </svg>
    ),
  };
  return icons[name] || null;
}
function KPI({ title, value }) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

// --- Utils ---
const fmtMoney = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(n || 0));
const fmtDate = (s) => (s ? new Date(s.replace(" ", "T")) : null);
const groupBy = (arr, keyFn) =>
  arr.reduce((acc, x) => {
    const k = keyFn(x);
    acc[k] ||= [];
    acc[k].push(x);
    return acc;
  }, {});

// --- Helpers robustos ---
const COMMISSION_FACTOR = {
  "QR BCM": 0.992,
  "Mercado Pago(QR)": 0.992,
  "Mercado Pago (QR)": 0.992,
  "Mercado Pago(TD)": 0.9865,
  "Mercado Pago(TC)": 0.9371,
};

const toNumber = (x) => {
  if (x == null) return 0;
  if (typeof x === "number") return Number.isFinite(x) ? x : 0;
  let s = String(x).trim();
  if (!s) return 0;
  // Si parece formato latino (tiene ',' como decimal), normalizamos:
  const comma = s.includes(",");
  const dot = s.includes(".");
  if (comma && (!dot || s.lastIndexOf(",") > s.lastIndexOf("."))) {
    s = s.replace(/\./g, "").replace(/,/g, "."); // "1.234,56" -> "1234.56"
  } else {
    s = s.replace(/,/g, ""); // "1,234.56" -> "1234.56"
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

const parseDate = (s) => {
  if (!s) return null;
  const t = String(s).trim();
  // ISO-like: "YYYY-MM-DD HH:MM[:SS]"
  if (/^\d{4}-\d{2}-\d{2}(?: [0-2]\d:[0-5]\d(?::[0-5]\d)?)?$/.test(t)) {
    const d = new Date(t.replace(" ", "T"));
    return isNaN(d) ? null : d;
  }
  // LatAm: "DD/MM/YYYY[ HH:MM[:SS]]" o con guiones
  const m = t.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (m) {
    const [, d, mo, y, hh = "0", mm = "0", ss = "0"] = m;
    const out = new Date(+y, +mo - 1, +d, +hh, +mm, +ss);
    return isNaN(out) ? null : out;
  }
  const d = new Date(t);
  return isNaN(d) ? null : d;
};

const normMethod = (m) => {
  const x = (m || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (x.includes("qr bcm")) return "QR BCM";
  if (x.includes("mercado pago (td)") || x.includes("débito") || x.includes("debito") || x.includes("td")) return "Mercado Pago(TD)";
  if (x.includes("tc") || x.includes("crédito") || x.includes("credito")) return "Mercado Pago(TC)";
  if (x.includes("qr")) return "Mercado Pago(QR)";
  return m || "Desconocido";
};

// arriba del componente
const COLOR_BY_METHOD = {
  "Mercado Pago(QR)": "#2563EB",
  "Mercado Pago(TC)": "#F59E0B",
  "Mercado Pago(TD)": "#10B981",
  "QR BCM":           "#06B6D4",
  "Boleta BCM":       "#7f629b9c", // violet
};
const PALETTE = ["#5b5c91ff","#aa884cff","#5ea890ff","#549daaaf","#7f629b9c","#d47575a6","#5fbe829c","#67a4c0a9"];

export default function BackofficeIngresos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [daysWindow, setDaysWindow] = useState(90);

  // --- fetchReceipts robusto ---
const fetchReceipts = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("authToken");
    const url = `${process.env.REACT_APP_BACKEND_URL}/forms/receipts`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(token ? { "x-access-token": token } : {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} – No se pudo obtener ingresos`);

    const rows = await res.json();

    // DEBUG rápido (podés dejarlo un rato):
    console.log("rows sample:", rows?.slice?.(0, 3));
    console.log("status únicos:", [...new Set(rows.map(r => r.status))]);
    console.log("métodos únicos:", [...new Set(rows.map(r => r.payment_method))]);

    const normalized = rows
      // Si el backend no manda status, NO filtramos; si lo manda, aceptamos los que "parecen pagados"
      .filter((r) => !r.status || /pag/i.test(String(r.status)))
      .map((r) => {
        const payment_method = normMethod(r.payment_method || inferPaymentMethod(r));
        const bruto = toNumber(r.total_depositado);
        const factor = COMMISSION_FACTOR[payment_method] ?? 1;
        const neto = +(bruto * factor).toFixed(2);

        const fecha_pago_date = parseDate(r.fecha_pago);

        return {
          ...r,
          total_depositado: bruto,
          payment_method,
          total_depositado_neto: neto,

          // desagregados por método si los necesitás
          total_bcm_qr_neto: payment_method === "QR BCM" ? neto : 0,
          total_mp_qr_neto: payment_method === "Mercado Pago(QR)" || payment_method === "Mercado Pago (QR)" ? neto : 0,
          total_mp_td_neto: payment_method === "Mercado Pago(TD)" ? neto : 0,
          total_mp_tc_neto: payment_method === "Mercado Pago(TC)" ? neto : 0,
          total_desconocido_neto: payment_method === "Desconocido" ? neto : 0,

          fecha_pago_date,
        };
      })
      // Si la fecha viene rara y no la podemos parsear, no tiramos todo: dejá pasar y mostralo al final si querés
      .filter((r) => r.fecha_pago_date instanceof Date && !isNaN(r.fecha_pago_date));

    setData(normalized);
  } catch (e) {
    console.error(e);
    setError(e.message || "Error cargando ingresos");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Ventana de tiempo ---
const desdeVentana = useMemo(() => {
  const d = new Date();
  d.setDate(d.getDate() - daysWindow);
  return d;
}, [daysWindow]);

// Base filtrada por ventana (USAR EN TODO)
const dataWindow = useMemo(() => {
  const fromTs = desdeVentana.getTime();
  const nowTs = Date.now();
  return data.filter((r) => {
    const t = r.fecha_pago_date?.getTime?.() ?? 0;
    return t >= fromTs && t <= nowTs;
  });
}, [data, desdeVentana]);

// --- KPIs sobre la ventana ---
const totalIngresos = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.total_depositado || 0), 0),
  [dataWindow]
);

const totalIngresos_menos_iva = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.total_depositado_menos_iva || 0), 0),
  [dataWindow]
);

const totalIngresosQrBcm = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.total_bcm_qr_neto || 0), 0),
  [dataWindow]
);

const totalIngresosMpQr = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.total_mp_qr_neto || 0), 0),
  [dataWindow]
);

const totalIngresosMpTc = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.total_mp_tc_neto || 0), 0),
  [dataWindow]
);

const totalIngresosMpTd = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.total_mp_td_neto || 0), 0),
  [dataWindow]
);
const totalIngresosDesconocidos = useMemo(
  () => dataWindow.reduce((acc, r) => acc + (r.totoal_desconocido_neto || 0), 0),
  [dataWindow]
);

const ticketPromedio = useMemo(
  () => (dataWindow.length ? totalIngresos / dataWindow.length : 0),
  [totalIngresos, dataWindow.length]
);

   
  // Filtro tabla
  const filteredRows = useMemo(() => {
    const q = (search || "").toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      [r.receipt_number, r.caratula, r.juicio_n, r.payment_id, r.payment_method]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }, [dataWindow,  search]);

  // // Series
  // const desdeVentana = useMemo(() => {
  //   const d = new Date();
  //   d.setDate(d.getDate() - daysWindow);
  //   return d;
  // }, [daysWindow]);

  const serieDiaria = useMemo(() => {
    const filtrado = data.filter((r) => r.fecha_pago_date >= desdeVentana);
    const porDia = groupBy(filtrado, (r) => r.fecha_pago_date.toISOString().slice(0, 10));
    return Object.entries(porDia)
      .map(([day, rows]) => ({
        day,
        ingresos: rows.reduce((a, r) => a + r.total_depositado, 0),
        cantidad: rows.length,
      }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [data, desdeVentana]);
  
  const serieMensual = useMemo(() => {
    const porMes = groupBy(data, (r) => r.fecha_pago_date.toISOString().slice(0, 7));
    return Object.entries(porMes)
    .map(([month, rows]) => ({ month, ingresos: rows.reduce((a, r) => a + r.total_depositado, 0) }))
    .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);
  
  // Pie por método (filtrado por ventana)
  const porMetodo = useMemo(() => {
    const acc = new Map();
    for (const r of dataWindow) {
      const m = r.payment_method || "Desconocido";
      const v = r.total_depositado ?? 0;        // o r.total_depositado_neto si querés el neto
      acc.set(m, (acc.get(m) || 0) + v);
    }
    return Array.from(acc, ([name, value]) => ({ name, value }))
      .filter(s => s.value > 0)                 // evita porciones en 0
      .sort((a, b) => b.value - a.value);
  }, [dataWindow]);


  const exportCSV = () => {
    const headers = [
      "fecha_pago",
      "receipt_number",
      "payment_id",
      "monto",
      "caratula",
      "juicio_n",
      "tasa_justicia",
      "payment_method",
      "status",
    ];
    const rows = filteredRows.map((r) =>
      [
        r.fecha_pago,
        r.receipt_number,
        r.payment_id,
        r.total_depositado,
        r.caratula,
        safe(r.juicio_n),
        r.tasa_justicia,
        r.payment_method,
        r.status,
      ].join(";")
    );
    const blob = new Blob([[headers.join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ingresos al ${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard de Ingresos</h1>
        <div className="flex items-center gap-2">
          <Button onClick={fetchReceipts}>
            <span className="inline-flex items-center gap-2"><Icon name="refresh" /> Actualizar</span>
          </Button>
          <Button onClick={exportCSV}>
            <span className="inline-flex items-center gap-2"><Icon name="download" /> Exportar CSV</span>
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
          <p className="font-medium text-red-700">Error</p>
          <p className="text-red-600">{error}</p>
          <p className="mt-1 text-red-500">Verificá el token (JWT) y REACT_APP_BACKEND_URL.</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI title="Ingresos totales" value={fmtMoney(totalIngresos)} />
        <KPI title="Recaudado Mercado Pago Qr" value={fmtMoney(totalIngresosMpQr)} />
        <KPI title="Recaudado Qr BCM" value={fmtMoney(totalIngresosQrBcm)} />
        <KPI title="Recaudado Mercado Pago TC" value={fmtMoney(totalIngresosMpTc)} />
        <KPI title="Recaudado Mercado Pago TD" value={fmtMoney(totalIngresosMpTd)} />
        {/* <KPI title="Ingresos totales Desconocidos" value={fmtMoney(totalIngresosDesconocidos)} /> */}
        {/* <KPI title="Últimos 30 días" value={fmtMoney(ultimos30)} /> */}
        <KPI title="DF promedio" value={fmtMoney(ticketPromedio)} />
        <KPI title="Cantidad de pagos" value={data.length} />
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Ventana:</span>
          <select
            className="border rounded-md px-2 py-1 dark:bg-neutral-1200 dark:border-neutral-700"
            value={daysWindow}
            onChange={(e) => setDaysWindow(Number(e.target.value))}
          >
            <option value={30}>30 días</option>
            <option value={60}>60 días</option>
            <option value={90}>90 días</option>
            <option value={180}>180 días</option>
            <option value={365}>1 año</option>
            <option value={730}>2 años</option>
          </select>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Ingresos diarios</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serieDiaria} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => fmtMoney(v)} />
                  <Line type="monotone" dataKey="ingresos" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Ingresos por metodo */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Ingresos por método</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porMetodo} dataKey="value" nameKey="name" outerRadius={90}>
                  {porMetodo.map((slice, i) => (
                    <Cell
                      key={slice.name}
                      fill={COLOR_BY_METHOD[slice.name] || PALETTE[i % PALETTE.length]}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtMoney(v)} />
                <Legend />
              </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Ingresos por mes */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium mb-2">Ingresos por mes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serieMensual}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmtMoney(v)} />
              <Bar dataKey="ingresos" fill="url(#barGrad)" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Buscar por carátula, recibo, expediente…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon name="filter" />
          </div>
        </div>
      </div>
      {/* Tabla */}
          
      <Card>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-auto">
            <table className="min-w-full text-sm table-fixed"> {/* table-fixed = no se estira */}
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 text-left w-36 whitespace-nowrap">Fecha pago</th>
                  <th className="px-3 py-2 text-left w-36 whitespace-nowrap">Recibo</th>
                  <th className="px-3 py-2 text-left w-32 whitespace-nowrap">Expediente</th>
                  {/* Carátula: única “ancha” y con wrap controlado */}
                  <th className="px-3 py-2 text-left w-[22rem] md:w-[28rem]">Carátula</th>
                  <th className="px-3 py-2 text-right w-28 whitespace-nowrap">Monto</th>
                  <th className="px-3 py-2 text-left w-36 whitespace-nowrap">Método</th>
                  <th className="px-3 py-2 text-left w-28 whitespace-nowrap hidden lg:table-cell">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td className="px-3 py-4" colSpan={7}>Cargando…</td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-4" colSpan={7}>Sin resultados</td>
                  </tr>
                ) : (
                  filteredRows.map((r) => (
                    <tr key={r.uuid} className="hover:bg-gray-50/70">
                      <td className="px-3 py-2 whitespace-nowrap">{fmtNiceDate(r.fecha_pago_date)}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{r.receipt_number}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.juicio_n}</td>
                      {/* Para “afinar”: en desktop truncamos, en mobile dejamos wrap corto */}
                      <td className="px-3 py-2 align-top">
                        <div className="md:truncate md:max-w-[28rem] md:whitespace-nowrap
                                        whitespace-normal break-words max-w-[22rem]">
                          {r.caratula}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{fmtMoney(r.total_depositado)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.payment_method}</td>
                      <td className="px-3 py-2 whitespace-nowrap hidden lg:table-cell">{r.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

function fmtNiceDate(d) {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "-";
  }
}
function safe(v) {
  return String(v ?? "").replaceAll(",", " ").replaceAll("", " ");
}
function inferPaymentMethod(r) {
  const id = (r?.payment_id || "").toLowerCase();
  if (id.includes("pos") || id.includes("card")) return "Mercado Pago(TC/TD)";
  return "Mercado Pago(QR)";
}
