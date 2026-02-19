import { useState, useEffect } from "react";
import ModalAddPatient from "./Composants/ModalAddPatient";
import ModalEditPatient from "./Composants/ModalEditPatient";
import useFetchPatients from "../../services/hooks/ListePatients/useFetchPatients";
import useAddPatient from "../../services/hooks/ListePatients/useAddPatient";
import useUpdatePatient from "../../services/hooks/ListePatients/useUpdatePatient";
import useDeletePatient from "../../services/hooks/ListePatients/useDeletePatient";

function AdminPatients() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const {
    patients,
    loading: loadingPatients,
    error: errorPatients,
    fetchPatients,
  } = useFetchPatients();

  const { addPatient, loading: loadingAdd } = useAddPatient();
  const { updatePatient, loading: loadingUpdate } = useUpdatePatient();
  const { deletePatient, loading: loadingDelete } = useDeletePatient();

  // Debug : afficher la liste des patients à chaque rendu
  console.log("patients", patients);

  const handleAddPatient = async (patientData) => {
    try {
      await addPatient(patientData);
      setOpenModal(false);
      fetchPatients();
    } catch (e) {
      // Afficher une erreur/toast si besoin
    }
  };

  const handleEditPatient = async (patientData) => {
    try {
      await updatePatient(patientData.id, patientData);
      setOpenEditModal(false);
      setSelectedPatient(null);
      fetchPatients();
      // Afficher un toast de succès ici si besoin
    } catch (e) {
      // Afficher une erreur/toast si besoin
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce patient ?")) return;
    try {
      await deletePatient(id);
      fetchPatients();
      // Afficher un toast de succès ici si besoin
    } catch (e) {
      // Afficher une erreur/toast si besoin
    }
  };

  return (
    <div className="w-full h-full space-y-1">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6">
        Gestion des patients
      </h1>
      {/* Bouton ajouter un patient */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          onClick={() => setOpenModal(true)}
        >
          + Ajouter un patient
        </button>
      </div>
      <ModalAddPatient
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddPatient}
      />
      <ModalEditPatient
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedPatient(null);
        }}
        onEdit={handleEditPatient}
        patient={selectedPatient}
      />
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl shadow-lg">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                <th className="py-3 px-4 text-sm font-bold rounded-tl-xl text-left">
                  Nom
                </th>
                <th className="py-3 px-4 text-sm font-bold text-left">
                  Prénom
                </th>
                <th className="py-3 px-4 text-sm font-bold text-left">Email</th>
                <th className="py-3 px-4 text-sm font-bold text-left">
                  Téléphone
                </th>
                <th className="py-3 px-4 text-sm font-bold text-left">
                  Date de naissance
                </th>
                <th className="py-3 px-4 text-sm font-bold text-left">
                  Adresse
                </th>
                <th className="py-3 px-4 text-sm font-bold text-left">
                  Consultations
                </th>
                <th className="py-3 px-4 text-sm font-bold rounded-tr-xl text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingPatients ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Chargement...
                  </td>
                </tr>
              ) : errorPatients ? (
                <tr>
                  <td colSpan={6} className="text-center text-red-500 py-6">
                    Erreur lors du chargement des patients
                  </td>
                </tr>
              ) : !(Array.isArray(patients) && patients.length > 0) ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Aucun patient trouvé
                  </td>
                </tr>
              ) : (
                (patients || []).map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className={`border-b border-blue-100 hover:bg-blue-50/60 transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}`}
                  >
                    <td className="py-3 px-4 font-semibold text-blue-900 rounded-l-xl text-left">
                      {patient.utilisateur?.nom}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {patient.utilisateur?.prenom}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {patient.utilisateur?.email}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {patient.utilisateur?.telephone}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {patient.dateNaissance || "-"}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {patient.adresse || "-"}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {patient.consultations ?? "-"}
                    </td>
                    <td className="py-3 px-4 rounded-r-xl flex gap-2 text-left">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setOpenEditModal(true);
                        }}
                        disabled={loadingUpdate}
                      >
                        {loadingUpdate && selectedPatient?.id === patient.id
                          ? "..."
                          : "Modifier"}
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                        onClick={() => handleDeletePatient(patient.id)}
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? "..." : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPatients;
