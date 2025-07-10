import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaAddressBook,
  FaEdit,
  FaGraduationCap,
  FaNewspaper,
  FaSignOutAlt,
  FaTag,
  FaMoneyCheckAlt,
  FaDollarSign,
  FaReceipt,
  FaUsers,
} from "react-icons/fa"; // Replacing PersonCircle with FaUserCircle

const Layout = () => {
  const [profiles, setProfiles] = useState(localStorage.getItem("profiles"));
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const username = localStorage.getItem("username");

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user info and profiles
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

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-lato">
      {/* Sidebar */}
      <div className="flex flex-row flex-grow">
        <aside className="w-1/6 bg-primary text-white flex flex-col items-center">
          {/* Logo */}
          <div className="my-6">
            <img
              src="/isologo-white.svg"
              alt="Logo"
              className="w-12 h-12 mx-auto object-cover"
            />
          </div>

          {/* Welcome Message */}
          <div className="mb-4 text-center">
            <p className="text-lg">¡Hola {username}!</p>
          </div>

          {/* Navigation Menu */}
          <nav className="w-full px-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/backoffice"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaNewspaper className="mr-2" />
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/capacitaciones"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/capacitaciones"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaGraduationCap className="mr-2" />
                  Capacitaciones
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/categorias"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/categorias"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaTag className="mr-2" />
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/edictos"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/edictos"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaEdit className="mr-2" />
                  Edictos
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/profesionales"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/profesionales"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaAddressBook className="mr-2" />
                  Profesionales
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/tasas"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/tasas"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaDollarSign className="mr-2" />
                  Tasas
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/historial-recibos"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/historial-recibos"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaReceipt className="mr-2" />
                  Historial de Recibos
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/actualizar-derecho-fijo"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/integrantes"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaUsers className="mr-2" />
                  Actualizar Derecho Fijo
                </Link>
              </li>
              <li>
                <Link
                  to="/backoffice/integrantes"
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.pathname === "/backoffice/integrantes"
                      ? "bg-secondary text-white"
                      : "hover:bg-secondary hover:text-white"
                  }`}
                >
                  <FaUsers className="mr-2" />
                  Nosotros
                </Link>
              </li>
            </ul>
          </nav>

          {/* Divider */}
          <hr className="border-gray-200 w-2/3 mt-auto" />

          {/* Logout Section */}
          <div className="my-6 w-full text-center">
            <button
              className="flex items-center justify-center w-full px-4 py-3 text-white rounded-lg hover:bg-red-700"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-grow bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
