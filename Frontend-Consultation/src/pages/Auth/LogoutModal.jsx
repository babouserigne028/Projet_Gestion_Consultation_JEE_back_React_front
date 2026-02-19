export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-200/30 via-white/10 to-blue-100/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-red-600 text-center">
          Déconnexion
        </h2>
        <p className="mb-6 text-center text-gray-700">
          Êtes-vous sûr de vouloir vous déconnecter&nbsp;?
        </p>
        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
            onClick={onConfirm}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
