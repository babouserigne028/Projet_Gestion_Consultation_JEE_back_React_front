import { useState } from "react";
import useDeleteMedecin from "../../services/hooks/admin/ListeMedecins/useDeleteMedecin";
import ModalAddMedecin from "./Composants/ModalAddMedecin";
import ModalEditMedecin from "./Composants/ModalEditMedecin";
import useFetchListeMedecin from "../../services/hooks/admin/ListeMedecins/useFetchListeMedecin";
function AdminMedecins() {
  const {
    deleteMedecin: deleteMedecinHook,
    loading: loadingDelete,
    error: errorDelete,
    data: dataDelete,
    reset: resetDelete,
  } = useDeleteMedecin();
  const { medecins, loading, error, refetch } = useFetchListeMedecin();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMedecin, setSelectedMedecin] = useState(null);

  // Ajout
  const handleAddMedecin = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleMedecinAdded = () => {
    refetch();
    setOpenAdd(false);
  };

  // Edition
  const handleEditMedecin = (medecin) => {
    //console.log("[AdminMedecins] Médecin envoyé au modal :", medecin);
    setSelectedMedecin(medecin);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedMedecin(null);
  };
  const handleMedecinEdited = () => {
    refetch();
    setOpenEdit(false);
    setSelectedMedecin(null);
  };

  return (
    <div className="w-full h-full space-y-8">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6">
        Gestion des médecins
      </h1>
      {/* Bouton ajouter un médecin */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          onClick={handleAddMedecin}
        >
          + Ajouter un médecin
        </button>
      </div>
      {/* Modal d'ajout de médecin */}
      <ModalAddMedecin
        open={openAdd}
        onClose={handleCloseAdd}
        onSubmit={handleMedecinAdded}
      />
      <ModalEditMedecin
        open={openEdit}
        onClose={handleCloseEdit}
        onSubmit={handleMedecinEdited}
        medecin={selectedMedecin}
      />
      {/* Tableau des médecins (CRUD) */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-600 font-semibold">
              Chargement...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 font-semibold">
              Erreur lors du chargement des médecins
            </div>
          ) : (
            <table className="min-w-full rounded-xl shadow-lg">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                  <th className="py-3 px-4 text-sm font-bold rounded-tl-xl text-left">
                    Nom
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Prénom
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Email
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Téléphone
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Spécialité
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Durée séance
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Adresse cabinet
                  </th>
                  <th className="py-3 px-4 text-sm font-bold text-left">
                    Actif
                  </th>
                  <th className="py-3 px-4 text-sm font-bold rounded-tr-xl text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {medecins.map((medecin, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-blue-100 hover:bg-blue-50/60 transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}`}
                  >
                    <td className="py-3 px-4 font-semibold text-blue-900 rounded-l-xl text-left">
                      {medecin.nom}
                    </td>
                    <td className="py-3 px-4 text-left">{medecin.prenom}</td>
                    <td className="py-3 px-4 text-left">{medecin.email}</td>
                    <td className="py-3 px-4 text-left">{medecin.telephone}</td>
                    <td className="py-3 px-4 text-left">
                      {medecin.specialite}
                    </td>
                    <td className="py-3 px-4 text-left">
                      {medecin.dureeSeance} min
                    </td>
                    <td className="py-3 px-4 text-left">
                      {medecin.adresseCabinet}
                    </td>
                    <td className="py-3 px-4 text-left">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${medecin.actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {medecin.actif ? "Oui" : "Non"}
                      </span>
                    </td>
                    <td className="py-3 px-4 rounded-r-xl">
                      <div className="flex gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                          onClick={() => handleEditMedecin(medecin)}
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                          disabled={loadingDelete}
                          onClick={async () => {
                            const ok = await deleteMedecinHook(medecin.id);
                            if (ok) {
                              refetch();
                            }
                          }}
                        >
                          {loadingDelete ? "Suppression..." : "Supprimer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMedecins;
