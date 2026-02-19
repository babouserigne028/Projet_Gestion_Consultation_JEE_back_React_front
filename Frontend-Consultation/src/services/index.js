// Export des services API
export { default as authService } from "./api/authService";
export { default as patientService } from "./api/patientService";
export { default as medecinService } from "./api/medecinService";
export { default as crenauxService } from "./api/crenauxService";
export { default as planningConfigService } from "./api/planningConfigService";
export { default as rendezVousService } from "./api/rendezVousService";
export { default as utilisateurService } from "./api/utilisateurService";
export { default as servicesService } from "./api/servicesService";
export { default as consultationService } from "./api/consultationService";
export { default as apiClient } from "./api/client";

// Export des hooks d'authentification
export { default as useLogin } from "./hooks/auth/useLogin";
export { default as useLogout } from "./hooks/auth/useLogout";
export { default as useRegister } from "./hooks/auth/useRegister";

// Export des hooks patients
export { default as useGetAllPatients } from "./hooks/patients/useGetAllPatients";
export { default as useAddPatient } from "./hooks/patients/useAddPatient";
export { default as useUpdatePatient } from "./hooks/patients/useUpdatePatient";
export { default as useDeletePatient } from "./hooks/patients/useDeletePatient";
export { default as usePatientsRecentsMedecin } from "./hooks/patients/usePatientsRecentsMedecin";

// Export des hooks médecins
export { default as useGetAllMedecins } from "./hooks/medecins/useGetAllMedecins";
export { default as useRegisterMedecin } from "./hooks/medecins/useRegisterMedecin";
export { default as useUpdateMedecin } from "./hooks/medecins/useUpdateMedecin";
export { default as useDeleteMedecin } from "./hooks/medecins/useDeleteMedecin";
export { default as useMedecinsByService } from "./hooks/medecins/useMedecinsByService";

// Export des hooks créneaux
export { default as useCrenauxMedecin } from "./hooks/creneaux/useCrenauxMedecin";
export { default as useGenererCreneaux } from "./hooks/creneaux/useGenererCreneaux";
export { default as useChangerStatutCreneau } from "./hooks/creneaux/useChangerStatutCreneau";
export { default as useCreneauxDisponibles } from "./hooks/creneaux/useCreneauxDisponibles";

// Export des hooks planning
export { default as useAddPlanningConfig } from "./hooks/planning/useAddPlanningConfig";
export { default as usePlanningsByDateRange } from "./hooks/planning/usePlanningsByDateRange";
export { default as useAddPlanningConfigMulti } from "./hooks/planning/useAddPlanningConfigMulti";

// Export des hooks rendez-vous
export { default as usePrendreRendezVous } from "./hooks/rendezVous/usePrendreRendezVous";
export { default as useRendezVousStats } from "./hooks/rendezVous/useRendezVousStats";
export { default as useStatsJourMedecin } from "./hooks/rendezVous/useStatsJourMedecin";
export { default as useChangerStatutRDV } from "./hooks/rendezVous/useChangerStatutRDV";
export { default as usePlanningSemaneMedecin } from "./hooks/rendezVous/usePlanningSemaneMedecin";
export { default as useHistoriqueMedecin } from "./hooks/rendezVous/useHistoriqueMedecin";
// Hooks patient
export { default as useRendezVousPatient } from "./hooks/rendezVous/useRendezVousPatient";
export { default as useProchainRendezVousPatient } from "./hooks/rendezVous/useProchainRendezVousPatient";
export { default as useStatsPatient } from "./hooks/rendezVous/useStatsPatient";
export { default as useAnnulerRendezVous } from "./hooks/rendezVous/useAnnulerRendezVous";

// Export des hooks utilisateurs
export { default as useUserStats } from "./hooks/utilisateurs/useUserStats";
export { default as useMedecinsParService } from "./hooks/utilisateurs/useMedecinsParService";
export { default as useGetAdmins } from "./hooks/utilisateurs/useGetAdmins";
export { default as useRegisterAdmin } from "./hooks/utilisateurs/useRegisterAdmin";
export { default as useDeleteAdmin } from "./hooks/utilisateurs/useDeleteAdmin";
export { default as useUpdateAdmin } from "./hooks/utilisateurs/useUpdateAdmin";

// Export des hooks services (existants)
export { default as useFetchServices } from "./hooks/ListeServices/useFetchServices";
export { default as useCreateService } from "./hooks/ListeServices/useCreateService";
export { default as useUpdateService } from "./hooks/ListeServices/useUpdateService";
export { default as useDeleteService } from "./hooks/ListeServices/useDeleteService";
export { default as useServiceStats } from "./hooks/ListeServices/useServiceStats";
export { default as useFetchServiceById } from "./hooks/ListeServices/useFetchServiceById";
