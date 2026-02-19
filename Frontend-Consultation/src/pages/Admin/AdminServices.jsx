import { useState } from "react";
import ModalEditService from "./Composants/ModalEditService";
import ModalAddService from "./Composants/ModalAddService";
import useCreateService from "../../services/hooks/ListeServices/useCreateService";
import useFetchServices from "../../services/hooks/ListeServices/useFetchServices";
import useDeleteService from "../../services/hooks/ListeServices/useDeleteService";
import useUpdateService from "../../services/hooks/ListeServices/useUpdateService";

function AdminServices() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { services, loading, error, refetch } = useFetchServices();
  const {
    createService,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateService();
  const {
    deleteService,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteService();
  const {
    updateService,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateService();

  return (
    <div className="w-full h-full space-y-1">
      <h1 className="text-2xl font-extrabold text-blue-800 mb-6">
        Services médicaux
      </h1>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
          onClick={() => setOpenAddModal(true)}
        >
          + Ajouter un service
        </button>
      </div>
      <ModalAddService
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={async (data) => {
          try {
            await createService(data);
            setOpenAddModal(false);
            refetch();
          } catch (e) {
            // gestion d'erreur déjà dans le hook
          }
        }}
        loading={loadingCreate}
        error={errorCreate}
      />
      <ModalEditService
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedService(null);
        }}
        onEdit={async (data) => {
          if (!selectedService) return;
          try {
            await updateService(selectedService.id, data);
            setOpenEditModal(false);
            setSelectedService(null);
            refetch();
          } catch (e) {
            // gestion d'erreur déjà dans le hook
          }
        }}
        service={selectedService}
        loading={loadingUpdate}
        error={errorUpdate}
      />
      <div className="bg-white/80 border border-blue-100 rounded-2xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
              <th className="py-3 px-4 text-sm font-bold rounded-tl-xl text-left">
                Nom
              </th>
              <th className="py-3 px-4 text-sm font-bold text-left">
                Description
              </th>
              <th className="py-3 px-4 text-sm font-bold text-left">
                Médecins associés
              </th>
              <th className="py-3 px-4 text-sm font-bold rounded-tr-xl text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => (
              <tr
                key={service.id}
                className={`border-b border-blue-100 hover:bg-blue-50/60 transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}`}
              >
                <td className="py-3 px-4 font-semibold text-blue-900 rounded-l-xl text-left">
                  {service.nom}
                </td>
                <td className="py-3 px-4 text-left">{service.description}</td>
                <td className="py-3 px-4 text-left">{service.medecins}</td>
                <td className="py-3 px-4 rounded-r-xl flex gap-2 text-left">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                    onClick={() => {
                      setSelectedService(service);
                      setOpenEditModal(true);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-60"
                    disabled={loadingDelete}
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Voulez-vous vraiment supprimer ce service ?",
                        )
                      ) {
                        try {
                          await deleteService(service.id);
                          refetch();
                        } catch (e) {
                          // gestion d'erreur déjà dans le hook
                        }
                      }
                    }}
                  >
                    {loadingDelete ? "Suppression..." : "Supprimer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServices;
