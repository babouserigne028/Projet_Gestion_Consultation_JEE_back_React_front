import { useState } from "react";
import useLogin from "../../services/hooks/auth/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#c7d2fe]">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl p-10 border border-blue-100 backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-1">
            Consultation Santé
          </h1>
          <p className="text-gray-500 text-base">
            Connectez-vous à votre espace sécurisé
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-7">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="email"
            >
              Adresse email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M4 4h16v16H4V4zm0 0l8 8 8-8"
                  />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                className="pl-10 pr-3 py-2 w-full border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 text-blue-900 placeholder:text-blue-300"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2z"
                  />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="pl-10 pr-10 py-2 w-full border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 text-blue-900 placeholder:text-blue-300"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-blue-400 hover:text-blue-600"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10-7 .21-1.13.7-2.19 1.41-3.13M6.7 6.7A9.97 9.97 0 0112 5c5 0 9.27 3.11 10 7-.21 1.13-.7 2.19-1.41 3.13M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M12 5c5 0 9.27 3.11 10 7-.73 3.89-5 7-10 7s-9.27-3.11-10-7c.73-3.89 5-7 10-7zm0 4a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg text-lg tracking-wide transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <div className="mt-6 flex flex-col items-center">
          <span className="mt-2 text-xs text-gray-400">
            © {new Date().getFullYear()} Consultation Santé
          </span>
        </div>
      </div>
    </div>
  );
}
