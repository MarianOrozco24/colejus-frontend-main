import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/login";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form input changes
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSpinner(true);

    try {
      const response = await login(formData.email, formData.password); // Call the modified login function

      // console.log(response);
      setSpinner(false);

      if (response.data && response.data.auth_token) {
        // Save token and profiles to localStorage
        localStorage.setItem("authToken", response.data.auth_token);
        localStorage.setItem(
          "profiles",
          JSON.stringify(response.data.profiles)
        );
        localStorage.setItem("username", response.data.name);

        // Navigate to home
        navigate("/backoffice");
      } else {
        setErrorMessage(response.data?.message || "Usuario no autorizado");
        setShowErrorModal(true);
      }
    } catch (error) {
      setSpinner(false);
      setErrorMessage("Nombre de usuario o contraseña incorrecto");
      setShowErrorModal(true);
      console.error("Login error:", error);
    }
  };

  // Close the error modal
  const handleClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center font-lato">
      <div className="text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <img
            src="/logo-grande.png" // Replace with your logo path
            alt="Logo"
            className="w-96 mx-auto"
          />
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* email Input */}
          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Usuario"
              className="w-80 bg-white text-gray-800 rounded-full px-6 py-3 focus:outline-none shadow-md"
              required
            />
            <p className="text-xs text-gray-300 mt-1">*Campos obligatorios</p>
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder="Contraseña"
              className="w-80 bg-white text-gray-800 rounded-full px-6 py-3 focus:outline-none shadow-md"
              required
            />
            <p className="text-xs text-gray-300 mt-1">*Campos obligatorios</p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={spinner}
              className={`w-80 ${
                spinner
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-secondary hover:bg-secondary-dark"
              } text-white font-medium rounded-full px-6 py-3 shadow-md transition`}
            >
              {spinner ? "Cargando..." : "Ingresar"}
            </button>
          </div>
        </form>

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Error</h3>
              <p className="text-gray-700">{errorMessage}</p>
              <button
                onClick={handleClose}
                className="mt-4 bg-secondary text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
