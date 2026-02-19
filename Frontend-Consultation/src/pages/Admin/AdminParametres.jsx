import { useSelector } from "react-redux";
import { useState } from "react";
import useUpdateCurrentUser from "../../services/hooks/auth/useUpdateCurrentUser";

function AdminParametres() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nom: currentUser?.nom || "",
    prenom: currentUser?.prenom || "",
    email: currentUser?.email || "",
    motDePasse: "",
    telephone: currentUser?.telephone || "",
    role: currentUser?.role || "",
    actif: currentUser?.actif || false,
  });
  const { updateCurrentUser, loading, error } = useUpdateCurrentUser();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      nom: currentUser?.nom || "",
      prenom: currentUser?.prenom || "",
      email: currentUser?.email || "",
      motDePasse: "",
      telephone: currentUser?.telephone || "",
      role: currentUser?.role || "",
      actif: currentUser?.actif || false,
    });
  };
  const handleSave = async () => {
    try {
      const dataToSend = { ...form };
      if (!dataToSend.motDePasse) delete dataToSend.motDePasse;
      await updateCurrentUser(dataToSend);
      setEditMode(false);
    } catch (e) {
      // L'erreur est déjà gérée par le hook
    }
  };

  // Debug: vérifier si currentUser existe
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-600 font-semibold">
          Aucun utilisateur connecté trouvé. Veuillez vous reconnecter.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-1">
      <div className="bg-white/90 border border-blue-200 rounded-2xl shadow-xl p-8 w-full">
        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 text-left">
          Paramètres du compte
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="block text-blue-700 font-semibold mb-1">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-blue-700 font-semibold mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="block text-blue-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-blue-700 font-semibold mb-1">
              Mot de passe
            </label>
            <input
              type="text"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-blue-700 font-semibold mb-1">
              Téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {/* Le champ rôle et la possibilité de mettre actif ont été retirés */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            {!editMode ? (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                onClick={handleEdit}
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition disabled:opacity-60"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
                {error && (
                  <div className="md:col-span-2 text-red-600 font-semibold text-right mt-2">
                    {error.message || "Erreur lors de la mise à jour."}
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminParametres;
