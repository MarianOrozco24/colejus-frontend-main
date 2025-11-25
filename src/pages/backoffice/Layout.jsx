import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
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
} from "react-icons/fa";

const Layout = () => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username = localStorage.getItem("username");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

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
    { to: "/backoffice", label: "Noticias", icon: FaNewspaper },
    { to: "/backoffice/capacitaciones", label: "Capacitaciones", icon: FaGraduationCap },
    { to: "/backoffice/categorias", label: "Categorías", icon: FaTag },
    { to: "/backoffice/edictos", label: "Edictos", icon: FaEdit },
    { to: "/backoffice/profesionales", label: "Profesionales", icon: FaAddressBook },
    { to: "/backoffice/tasas", label: "Tasas", icon: FaDollarSign },
    { to: "/backoffice/historial-recibos", label: "Historial de Recibos", icon: FaReceipt },
    { to: "/backoffice/dashboard-ingresos", label: "Dashboard Ingresos", icon: FaReceipt },
    { to: "/backoffice/update-derecho-fijo", label: "Actualizar Derecho Fijo", icon: FaUsers },
    { to: "/backoffice/integrantes", label: "Nosotros", icon: FaUsers },
  ];

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
              {navLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      location.pathname === to
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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary text-white transition-transform duration-200 ease-in-out overflow-y-auto md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
