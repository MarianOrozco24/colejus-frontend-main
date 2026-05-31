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

  const pathToPermission = {
    "/backoffice/capacitaciones": "view_trainings",
    "/backoffice/categorias": "view_tags",
    "/backoffice/edictos": "view_edicts",
    "/backoffice/profesionales": "view_professionals",
    "/backoffice/tasas": "view_rates",
    "/backoffice/historial-recibos": "view_receipts",
    "/backoffice/dashboard-ingresos": "view_revenue",
    "/backoffice/update-derecho-fijo": "view_collection_admin",
    "/backoffice/integrantes": "view_integrantes",
    "/backoffice/reservar-sala": "book_rooms",
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const currentPath = location.pathname;
    const isDevUser = profiles.some(p => p.profile_name?.toLowerCase() === 'dev');

    if (!isDevUser) {
      const matchedPath = Object.keys(pathToPermission).find(p => currentPath.startsWith(p));
      if (matchedPath) {
        const requiredPermission = pathToPermission[matchedPath];
        if (!hasPermission(requiredPermission)) {
          navigate("/backoffice"); 
        }
      } else if (currentPath === "/backoffice") {
        if (!hasPermission("view_news")) {
          const firstPermittedLink = navLinks.find(link => {
            if (link.to === "/backoffice") return false;
            if (link.to === "/backoffice/dev-panel") return isDevUser;
            return link.permission && hasPermission(link.permission);
          });
          if (firstPermittedLink) {
            navigate(firstPermittedLink.to);
          } else {
            navigate("/");
          }
        }
      }
    }
  }, [location.pathname, token, profiles, navigate]);

  // const moduleToPath = {
  //     Perfiles: "/backoffice/profiles",
  //     Usuarios: "/backoffice/users",
  //     Clientes: "/backoffice/clients",
  //     Proveedor: "/backoffice/providers",
  //     Productos: "/backoffice/products",
  //     Categorías: "/backoffice/categories",
  // };

  // const allowedLinks = profiles
  //     ? profiles.flatMap((profile) =>
  //         profile.accesses.map((access) => access.name)
  //     )
  //     : [];

  // useEffect(() => {
  //     const currentPathAccess = Object.values(moduleToPath).find((path) =>
  //         location.pathname.startsWith(path)
  //     );
  //     if (
  //         currentPathAccess &&
  //         !allowedLinks.includes(`view_${currentPathAccess.slice(6).toLowerCase()}`)
  //     ) {
  //         navigate("/home");
  //     }
  // }, [allowedLinks, location.pathname, navigate, moduleToPath]);

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
    { to: "/backoffice/update-derecho-fijo", label: "Actualizar Derecho Fijo", icon: FaUsers, permission: "view_collection_admin" },
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
    </div>
  );
};

export default Layout;
