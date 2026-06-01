import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { hasPermission } from "../../utils/hasPermission";
import {
  FaAddressBook,
  FaEdit,
  FaGraduationCap,
  FaNewspaper,
  FaSignOutAlt,
  FaTag,
  FaDollarSign,
  FaReceipt,
  FaUsers,
  FaBars,
  FaTimes,
  FaTerminal,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";

const Layout = () => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username = localStorage.getItem("username");
  
  const [profiles] = useState(() => {
    const p = localStorage.getItem("profiles");
    return p ? JSON.parse(p) : [];
  });

  const isDev = profiles.some(p => p.profile_name?.toLowerCase() === 'dev');

  const location = useLocation();
  const navigate = useNavigate();

  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    const checkValidation = async () => {
      const isLawyer = profiles.some(p => (p.name || p.profile_name || '').toLowerCase() === 'lawyer');
      const isAdminOrDevUser = profiles.some(p => ['admin', 'dev'].includes((p.name || p.profile_name || '').toLowerCase()));
      const isValidationDisabled = localStorage.getItem("disableMembershipValidation") === "true";

      if (isLawyer && !isAdminOrDevUser && !isValidationDisabled && token) {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lawyer_payments/validate`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.status === 402 || !data.paid) {
            setValidationMessage(data.message || "Falta de pago de la membresía del mes en curso.");
            setShowValidationModal(true);
          }
        } catch (err) {
          console.error("Error validating payment:", err);
        }
      }
    };

    checkValidation();
  }, [profiles, token]);


  const pathToPermission = {
    "/backoffice/nueva-noticia": "manage_news",
    "/backoffice/editar-noticia": "manage_news",
    
    "/backoffice/capacitaciones": "view_trainings",
    "/backoffice/nueva-capacitacion": "manage_trainings",
    "/backoffice/editar-capacitacion": "manage_trainings",
    
    "/backoffice/categorias": "view_tags",
    
    "/backoffice/edictos": "view_edicts",
    "/backoffice/nuevo-edicto": "manage_edicts",
    "/backoffice/editar-edicto": "manage_edicts",
    
    "/backoffice/profesionales": "view_professionals",
    "/backoffice/nuevo-profesional": "manage_professionals",
    "/backoffice/editar-profesional": "manage_professionals",
    
    "/backoffice/tasas": "view_rates",
    "/backoffice/nueva-tasa": "manage_rates",
    
    "/backoffice/historial-recibos": "view_receipts",
    
    "/backoffice/dashboard-ingresos": "view_revenue",
    
    "/backoffice/pagos-membresias": "view_lawyer_payments",
    
    "/backoffice/administrador-cobros": "view_collection_admin",
    
    "/backoffice/integrantes": "view_integrantes",
    "/backoffice/reservar-sala": "book_rooms",
  };

  const devPaths = [
    "/backoffice/dev-panel",
    "/backoffice/ip-manager",
    "/backoffice/log-history",
    "/backoffice/user-manager",
    "/backoffice/profile-manager"
  ];


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const currentPath = location.pathname;
    const isDevUser = profiles.some(p => p.profile_name?.toLowerCase() === 'dev');

    // 1. Guard dev paths
    const isDevPath = devPaths.some(p => currentPath.startsWith(p));
    if (isDevPath && !isDevUser) {
      navigate("/backoffice");
      return;
    }

    // 2. Guard standard paths
    if (!isDevUser) {
      const matchedPath = Object.keys(pathToPermission).find(p => currentPath.startsWith(p));
      if (matchedPath) {
        const requiredPermission = pathToPermission[matchedPath];
        if (!hasPermission(requiredPermission)) {
          navigate("/backoffice"); 
        }
      } else if (currentPath === "/backoffice") {
        // Guard root backoffice index (news list)
        if (!hasPermission("view_news")) {
          // Redirect to the first permitted section
          const firstPermittedLink = navLinks.find(link => {
            if (link.to === "/backoffice") return false;
            if (link.to === "/backoffice/dev-panel") return isDevUser;
            return link.permission && hasPermission(link.permission);
          });
          if (firstPermittedLink) {
            navigate(firstPermittedLink.to);
          } else {
            // No permissions at all in backoffice
            navigate("/");
          }
        }
      }
    }
  }, [location.pathname, token, profiles, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  };

  const navLinks = [
    { to: "/backoffice", label: "Noticias", icon: FaNewspaper, permission: "view_news" },
    { to: "/backoffice/capacitaciones", label: "Capacitaciones", icon: FaGraduationCap, permission: "view_trainings" },
    { to: "/backoffice/categorias", label: "Categorías", icon: FaTag, permission: "view_tags" },
    { to: "/backoffice/edictos", label: "Edictos", icon: FaEdit, permission: "view_edicts" },
    { to: "/backoffice/profesionales", label: "Profesionales", icon: FaAddressBook, permission: "view_professionals" },
    { to: "/backoffice/tasas", label: "Tasas", icon: FaDollarSign, permission: "view_rates" },
    { to: "/backoffice/historial-recibos", label: "Historial de Recibos", icon: FaReceipt, permission: "view_receipts" },
    { to: "/backoffice/dashboard-ingresos", label: "Dashboard Ingresos", icon: FaReceipt, permission: "view_revenue" },
    { to: "/backoffice/pagos-membresias", label: "Membresías Abogados", icon: FaDollarSign, permission: "view_lawyer_payments" },
    { to: "/backoffice/administrador-cobros", label: "Administrador de Cobros", icon: FaDollarSign, permission: "view_collection_admin" },
    { to: "/backoffice/integrantes", label: "Nosotros", icon: FaUsers, permission: "view_integrantes" },
    { to: "/backoffice/reservar-sala", label: "Reservar Sala", icon: FaCalendarAlt, permission: "book_rooms" },
    ...(isDev ? [{ to: "/backoffice/dev-panel", label: "Dev Panel", icon: FaTerminal }] : []),
  ];

  const filteredNavLinks = navLinks.filter(link => {
    if (link.permission) {
      return hasPermission(link.permission);
    }
    return true; // Dev Panel handled by isDev condition
  });

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="my-6 text-center">
        <img
          src="/isologo-white.svg"
          alt="Logo"
          className="w-14 h-14 mx-auto object-cover"
        />
        <p className="mt-4 text-lg">¡Hola {username}!</p>
      </div>
      <nav className="w-full px-4">
        <ul className="space-y-1">
          {filteredNavLinks.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === to
                    ? "bg-secondary text-white"
                    : "hover:bg-secondary hover:text-white"
                  }`}
              >
                <Icon className="mr-2" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="border-gray-200 w-2/3 mt-auto" />

      <div className="my-6 w-full text-center px-4">
        <button
          className="flex items-center justify-center w-full px-4 py-3 text-white rounded-lg hover:bg-red-700"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-lato">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary text-white transition-transform duration-200 ease-in-out overflow-y-auto md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-0">
        <header className="flex items-center justify-between bg-primary text-white px-4 py-3 md:hidden">
          <button
            className="text-white"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <span className="text-sm">Backoffice</span>
          <div className="w-5" />
        </header>

        <main className="flex-1 bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Validation Warning Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center p-4 z-50 animate-fade-in font-lato">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-red-100">
            <div className="bg-red-600 p-6 text-white text-lg font-bold flex items-center gap-3">
              <FaExclamationTriangle className="text-white text-xl animate-bounce" /> Membresía Pendiente
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {validationMessage || "Estimado/a abogado/a, se ha detectado que tiene pendiente el pago de la membresía correspondiente al mes en curso."}
              </p>
              <p className="text-gray-500 text-xs font-medium">
                Por favor, diríjase a la sección de pagos o contáctese con la administración para regularizar su situación.
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm shadow-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
