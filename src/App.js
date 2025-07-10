import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Profesionales from "./pages/Profesionales";
import Contacto from "./pages/Contacto";
import DerechoFijo from "./pages/DerechoFijo";
import Liquidaciones from "./pages/Liquidaciones";
import Edictos from "./pages/Edictos/Edictos";
import LinksInteres from "./pages/LinksInteres";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Layout from "./pages/backoffice/Layout";
import BackOfficeNews from "./pages/backoffice/News/BackOfficeNews";
import NewNewsPage from "./pages/backoffice/News/NewNewsPage";
import BackOfficeTrainings from "./pages/backoffice/Trainings/BackOfficeTrainings";
import EditNewsPage from "./pages/backoffice/News/EditNewsPage";
import NewTrainingPage from "./pages/backoffice/Trainings/NewTrainingPage";
import EditTrainingPage from "./pages/backoffice/Trainings/EditTrainingPage";
import BackOfficeTags from "./pages/backoffice/tags/BackOfficeTags";
import BackOfficeEdicts from "./pages/backoffice/edicts/BackOfficeEdicts";
import NewEdictPage from "./pages/backoffice/edicts/NewEdictPage";
import EditEdictPage from "./pages/backoffice/edicts/EditEdictPage";
import Novedades from "./pages/Novedades";
import BackOfficeProfessionals from "./pages/backoffice/Professionals/BackOfficeProfessionals";
import NewProfessionalPage from "./pages/backoffice/Professionals/NewProfessionalPage";
import EditProfessionalPage from "./pages/backoffice/Professionals/EditProfessionalPage";
import VerEdicto from "./pages/Edictos/VerEdicto";
import BackOfficeRates from "./pages/backoffice/rates/BackOfficeRates";
import NewRatePage from "./pages/backoffice/rates/NewRatePage";
import VerNoticia from "./pages/VerNoticia";
import Receipts from "./pages/backoffice/receipts/Receipts";
import AdminDerechoFijo from "./pages/backoffice/admin_derecho_fijo/AdminDerechoFIjo"; // ajustá la ruta si es diferente
import Integrantes from "./pages/backoffice/integrantes/Integrantes";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/derecho-fijo" element={<DerechoFijo />} />
        <Route path="/liquidaciones" element={<Liquidaciones />} />
        <Route path="/edictos" element={<Edictos />} />
        <Route path="/edictos/:uuid" element={<VerEdicto />} />
        <Route path="/links-de-interes" element={<LinksInteres />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/noticias/:uuid" element={<VerNoticia />} />

        <Route path="/login" element={<Login />} />
        <Route path="/backoffice" element={<Layout />}>
          <Route index element={<BackOfficeNews />} />
          <Route path="nueva-noticia" element={<NewNewsPage />} />
          <Route path="editar-noticia/:uuid" element={<EditNewsPage />} />
          <Route path="nuevo-profesional" element={<NewProfessionalPage />} />
          <Route path="capacitaciones" element={<BackOfficeTrainings />} />
          <Route path="nueva-capacitacion" element={<NewTrainingPage />} />
          <Route
            path="editar-capacitacion/:uuid"
            element={<EditTrainingPage />}
          />
          <Route path="categorias" element={<BackOfficeTags />} />
          <Route path="edictos" element={<BackOfficeEdicts />} />
          <Route path="nuevo-edicto" element={<NewEdictPage />} />
          <Route path="editar-edicto/:uuid" element={<EditEdictPage />} />
          <Route path="profesionales" element={<BackOfficeProfessionals />} />
          <Route path="nuevo-profesional" element={<NewProfessionalPage />} />
          <Route
            path="editar-profesional/:uuid"
            element={<EditProfessionalPage />}
          />
          <Route path="tasas" element={<BackOfficeRates />} />
          <Route path="nueva-tasa" element={<NewRatePage />} />
          <Route path="historial-recibos" element={<Receipts />} />
          <Route path="actualizar-derecho-fijo" element={<AdminDerechoFijo />} />
          <Route path="integrantes" element={<Integrantes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
