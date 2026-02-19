import { useState } from "react";
import useAddAdmin from "../../services/hooks/admin/ListeAdmins/useAddAdmin";
import useDeleteUser from "../../services/hooks/admin/ListeAdmins/useDeleteUser";
import useEditUser from "../../services/hooks/admin/ListeAdmins/useEditUser";
import useFetchListeAdmins from "../../services/hooks/admin/ListeAdmins/useFetchListeAdmins";
import ModalAddAdmin from "./Composants/ModalAddAdmin";
import ModalEditAdmin from "./Composants/ModalEditAdmin";
export default function AdminLesAdmins() {
  const { data, loading, error, refetch } = useFetchListeAdmins();
  const {
    addAdmin,
    loading: adding,
    error: addError,
    data: addData,
    reset,
  } = useAddAdmin();
  const {
    deleteUser,
    loading: deleting,
    error: deleteError,
    success: deleteSuccess,
    reset: resetDelete,
  } = useDeleteUser();
  const {
    editUser,
    loading: editing,
    error: editError,
    data: editData,
    reset: resetEdit,
  } = useEditUser();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const handleOpen = () => {
    setOpen(true);
    reset();
    setSuccessMsg("");
  };
  const handleClose = () => {
    setOpen(false);
    reset();
    setSuccessMsg("");
  };

  const handleAddAdmin = async (formData) => {
    const adminData = { ...formData, role: "ADMIN", actif: true };
    const res = await addAdmin(adminData);
    if (res && !res.error) {
      setSuccessMsg("Administrateur ajouté avec succès !");
      refetch();
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    const res = await deleteUser(id);
    if (res) {
      refetch();
      setDeleteId(null);
      resetDelete();
    }
  };

  const handleEditOpen = (admin) => {
    setAdminToEdit(admin);
    setOpenEdit(true);
    resetEdit();
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setAdminToEdit(null);
    resetEdit();
  };

  const handleEditAdmin = async (formData) => {
    if (!adminToEdit) return;
    const res = await editUser(adminToEdit.id, { ...formData, role: "ADMIN" });
    if (res && !editError) {
      refetch();
      handleEditClose();
    }
  };

  return (
    <div className="w-full h-full space-y-8">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6">
        Gestion des administrateurs
      </h1>
      {/* Bouton ajouter un admin */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          onClick={handleOpen}
        >
          + Ajouter un admin
        </button>
      </div>
      <ModalAddAdmin
        open={open}
        onClose={handleClose}
        onSubmit={handleAddAdmin}
      />
      {/* Feedback ajout */}
      {open && (
        <div className="mt-2 text-center">
          {adding && (
            <span className="text-blue-600 font-semibold">
              Ajout en cours...
            </span>
          )}
          {addError && (
            <span className="text-red-600 font-semibold">
              Erreur : {addError.message || "Impossible d'ajouter l'admin."}
            </span>
          )}
          {successMsg && (
            <span className="text-green-600 font-semibold">{successMsg}</span>
          )}
        </div>
      )}
      {/* Tableau des admins harmonisé */}
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-600 font-semibold">
              Chargement...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 font-semibold">
              Erreur lors du chargement des administrateurs
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
                    Actif
                  </th>
                  <th className="py-3 px-4 text-sm font-bold rounded-tr-xl text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((admin, idx) => (
                    <tr
                      key={admin.id || idx}
                      className={`border-b border-blue-100 hover:bg-blue-50/60 transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}`}
                    >
                      <td className="py-3 px-4 font-semibold text-blue-900 rounded-l-xl text-left">
                        {admin.nom}
                      </td>
                      <td className="py-3 px-4 text-left">{admin.prenom}</td>
                      <td className="py-3 px-4 text-left">{admin.email}</td>
                      <td className="py-3 px-4 text-left">{admin.telephone}</td>
                      <td className="py-3 px-4 text-left">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold ${admin.actif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {admin.actif ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="py-3 px-4 rounded-r-xl flex gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                          onClick={() => handleEditOpen(admin)}
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                          onClick={() => handleDelete(admin.id)}
                          disabled={deleting && deleteId === admin.id}
                        >
                          {deleting && deleteId === admin.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun administrateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ModalEditAdmin
        open={openEdit}
        onClose={handleEditClose}
        onSubmit={handleEditAdmin}
        admin={adminToEdit}
      />
      {/* Feedback édition */}
      {openEdit && (
        <div className="mt-2 text-center">
          {editing && (
            <span className="text-blue-600 font-semibold">
              Modification en cours...
            </span>
          )}
          {editError && (
            <span className="text-red-600 font-semibold">
              Erreur : {editError.message || "Impossible de modifier l'admin."}
            </span>
          )}
        </div>
      )}
      {/* Feedback suppression */}
      {deleteError && (
        <div className="mt-2 text-center">
          <span className="text-red-600 font-semibold">
            Erreur lors de la suppression :{" "}
            {deleteError.message || "Impossible de supprimer l'admin."}
          </span>
        </div>
      )}
    </div>
  );
}
