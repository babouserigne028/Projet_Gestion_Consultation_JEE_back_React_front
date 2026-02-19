import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutModal from "../pages/Auth/LogoutModal";
import useLogout from "../services/hooks/auth/useLogout";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaUserMd,
  FaUserInjured,
  FaBriefcaseMedical,
  FaCogs,
  FaCalendarCheck,
  FaCalendarPlus,
  FaClock,
  FaHistory,
  FaHome,
  FaUserShield,
} from "react-icons/fa";

function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useLogout();
  const currentUser = useSelector((state) => state.user.currentUser);

  const menuItemsAdmin = [
    {
      to: "/admin/dashboard",
      icon: FaTachometerAlt,
      label: "Dashboard",
    },
    {
      to: "/admin/admins",
      icon: FaUserShield,
      label: "Admins",
    },
    {
      to: "/admin/medecins",
      icon: FaUserMd,
      label: "Médecins",
    },
    {
      to: "/admin/patients",
      icon: FaUserInjured,
      label: "Patients",
    },
    {
      to: "/admin/services",
      icon: FaBriefcaseMedical,
      label: "Services",
    },
    { to: "/admin/parametres", icon: FaCogs, label: "Paramètres" },
  ];

  const menuItemsMedecin = [
    {
      to: "/medecin/dashboard",
      icon: FaTachometerAlt,
      label: "Dashboard",
    },
    {
      to: "/medecin/planning",
      icon: FaCalendarPlus,
      label: "Gérer mon Planning",
    },
    {
      to: "/medecin/creneaux",
      icon: FaClock,
      label: "Mes Créneaux",
    },
    {
      to: "/medecin/historique",
      icon: FaHistory,
      label: "Historique RDV",
    },
    { to: "/medecin/profil", icon: FaUserMd, label: "Mon Profil" },
  ];

  const menuItemsPatient = [
    {
      to: "/patient/dashboard",
      icon: FaHome,
      label: "Accueil",
    },
    {
      to: "/patient/prendre-rdv",
      icon: FaCalendarPlus,
      label: "Prendre RDV",
    },
    {
      to: "/patient/mes-demandes",
      icon: FaClock,
      label: "Mes Demandes RDV",
    },
    {
      to: "/patient/mes-rdv",
      icon: FaCalendarCheck,
      label: "Mes Rendez-vous",
    },
    { to: "/patient/profil", icon: FaUsers, label: "Mon Profil" },
  ];

  return (
    <>
      <div className="hidden md:flex h-screen w-72 flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 bg-white/90 border border-blue-100 shadow-2xl rounded-r-3xl backdrop-blur-md">
        <nav className="flex-1 min-h-0 px-4 py-8 overflow-y-auto sidebar-scroll">
          <ul className="space-y-2">
            {currentUser?.role === "ADMIN" && (
              <>
                <h3 className="px-3 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                  Administration
                </h3>
                {menuItemsAdmin.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-blue-50/50 border border-blue-100 mb-1 ` +
                        (isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg border-blue-300"
                          : "text-blue-900 hover:bg-blue-100 hover:text-blue-700")
                      }
                    >
                      <span className="transition-all duration-300 group-hover:text-blue-600">
                        <item.icon size={20} />
                      </span>
                      <span className="font-medium transition-all duration-300 group-hover:text-blue-600">
                        {item.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </>
            )}
            {currentUser?.role === "MEDECIN" && (
              <>
                <h3 className="px-3 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                  Espace Médecin
                </h3>
                {menuItemsMedecin.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-blue-50/50 border border-blue-100 mb-1 ` +
                        (isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg border-blue-300"
                          : "text-blue-900 hover:bg-blue-100 hover:text-blue-700")
                      }
                    >
                      <span className="transition-all duration-300 group-hover:text-blue-600">
                        <item.icon size={20} />
                      </span>
                      <span className="font-medium transition-all duration-300 group-hover:text-blue-600">
                        {item.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </>
            )}
            {currentUser?.role === "PATIENT" && (
              <>
                <h3 className="px-3 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                  Espace Patient
                </h3>
                {menuItemsPatient.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-blue-50/50 border border-blue-100 mb-1 ` +
                        (isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg border-blue-300"
                          : "text-blue-900 hover:bg-blue-100 hover:text-blue-700")
                      }
                    >
                      <span className="transition-all duration-300 group-hover:text-blue-600">
                        <item.icon size={20} />
                      </span>
                      <span className="font-medium transition-all duration-300 group-hover:text-blue-600">
                        {item.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="group flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 bg-red-50/70 hover:bg-red-100 text-red-500 hover:text-red-700 w-full border border-red-100 font-bold"
          >
            <span className="transition-all duration-300 group-hover:scale-110 group-hover:text-red-700">
              <FaSignOutAlt size={18} />
            </span>
            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </>
  );
}

export default Sidebar;
