const Footer = () => {
  return (
    <footer className="bg-white/90 border-t border-blue-100 py-6 backdrop-blur-md rounded-t-3xl shadow-inner">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="#3B82F6" fillOpacity="0.15" />
            <path
              d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z"
              fill="#3B82F6"
            />
          </svg>
          <div className="text-sm">
            <p className="font-extrabold text-blue-800 text-lg leading-tight">
              Consultation Santé
            </p>
            <p className="text-blue-400 text-xs font-medium">
              Plateforme de gestion médicale
            </p>
          </div>
        </div>
        {/* Infos */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs">
          <span className="inline-flex items-center px-3 py-1 rounded-full font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            v1.0
          </span>
          <span className="text-blue-300 hidden md:inline">|</span>
          <span className="text-blue-400">
            © {new Date().getFullYear()} Consultation Santé
          </span>
          <span className="text-blue-300 hidden md:inline">|</span>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-600 transition-colors font-medium"
          >
            Mentions légales
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
