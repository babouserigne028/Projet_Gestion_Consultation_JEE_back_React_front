import { useTotalConsultation } from "../../services/hooks/admin/Dashboard/useTotalConsultation";
import { useTotalMedecinBySpecialite } from "../../services/hooks/admin/Dashboard/useTotalMedecinBySpecialite";
import { useTotalServices } from "../../services/hooks/admin/Dashboard/useTotalServices";
import { useTotalUser } from "../../services/hooks/admin/Dashboard/useTotalUser";
export default function AdminDashboard() {
  const { stats } = useTotalUser();
  const { stats: statConsultations } = useTotalConsultation();
  const { stats: statServices } = useTotalServices();
  const { data } = useTotalMedecinBySpecialite();
  return (
    <div className="w-full h-full space-y-1">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6">
        Tableau de bord
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-700">
            {stats?.total ?? 0}
          </span>
          <span className="text-blue-400 font-medium mt-2">Utilisateurs</span>
          <div className="flex gap-2 text-xs mt-2 text-blue-500">
            <span>Patients: {stats?.patients ?? 0}</span>
            <span>|</span>
            <span>Médecins: {stats?.medecins ?? 0}</span>
            <span>|</span>
            <span>Admins: {stats?.admins ?? 0}</span>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-700">
            {statConsultations?.total ?? 0}
          </span>
          <span className="text-blue-400 font-medium mt-2">Consultations</span>
          <div className="flex flex-col gap-1 text-xs mt-2 text-blue-500">
            <span>Réalisées: {statConsultations?.realisees ?? 0}</span>
            <span>À venir: {statConsultations?.a_venir ?? 0}</span>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-700">
            {statServices?.total ?? 0}
          </span>
          <span className="text-blue-400 font-medium mt-2">
            Services médicaux
          </span>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-700">
            {stats?.medecins ?? 0}
          </span>
          <span className="text-blue-400 font-medium mt-2">
            Médecins (spécialités)
          </span>
        </div>
      </div>
      <div className="bg-white/80 border border-blue-100 rounded-2xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Médecins par spécialité
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(data
            ? Object.entries(data).map(([specialite, count]) => ({
                specialite,
                count,
              }))
            : []
          ).map((item) => (
            <div
              key={item.specialite}
              className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4"
            >
              <span className="text-blue-600 font-semibold">
                {item.specialite}
              </span>
              <span className="ml-auto text-blue-800 font-bold text-lg">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
