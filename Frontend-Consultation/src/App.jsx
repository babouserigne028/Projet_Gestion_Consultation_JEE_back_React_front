import Login from "./pages/Auth/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./composants/PrivateRoute";
import DefaultLayout from "./layout/DefaultLayout";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminMedecins from "./pages/Admin/AdminMedecins";
import AdminPatients from "./pages/Admin/AdminPatients";
import AdminServices from "./pages/Admin/AdminServices";
import AdminParametres from "./pages/Admin/AdminParametres";
import AdminLesAdmins from "./pages/Admin/AdminLesAdmins";
import MedecinPlanning from "./pages/medecin/MedecinPlanning";
import MedecinCreneaux from "./pages/medecin/MedecinCreneaux";
import MedecinProfil from "./pages/medecin/MedecinProfil";
import MedecinHistorique from "./pages/medecin/MedecinHistorique";
import MedecinDashboard from "./pages/medecin/MedecinDashboard";
import PatientPrendreRdv from "./pages/patient/PatientPrendreRdv";
import PatientMesDemandes from "./pages/patient/PatientMesDemandes";
import PatientProfil from "./pages/patient/PatientProfil";
import PatientMesRdv from "./pages/patient/PatientMesRdv";
import PatientDashboard from "./pages/patient/PatientDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/medecins" element={<AdminMedecins />} />
            <Route path="/admin/admins" element={<AdminLesAdmins />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/parametres" element={<AdminParametres />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute allowedRoles={["MEDECIN"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/medecin/dashboard" element={<MedecinDashboard />} />
            <Route path="/medecin/planning" element={<MedecinPlanning />} />
            <Route path="/medecin/creneaux" element={<MedecinCreneaux />} />
            <Route path="/medecin/historique" element={<MedecinHistorique />} />
            <Route path="/medecin/profil" element={<MedecinProfil />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute allowedRoles={["PATIENT"]} />}>
          <Route element={<DefaultLayout />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient/prendre-rdv"
              element={<PatientPrendreRdv />}
            />
            <Route
              path="/patient/mes-demandes"
              element={<PatientMesDemandes />}
            />
            <Route path="/patient/mes-rdv" element={<PatientMesRdv />} />
            <Route path="/patient/profil" element={<PatientProfil />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
