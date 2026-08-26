import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { validateEmail, validatePassword } from "../utils/validation";

function Login({ keycloak }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keycloak) {
      keycloak.login();
      return;
    }
    setError("");

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setError(emailCheck.message);
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setError(passwordCheck.message);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_28%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_45%,_#f7f9ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="hero-gradient hidden w-[45%] flex-col justify-between p-10 text-white md:flex">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm font-medium">
              Secure AI-enabled healthcare platform
            </div>
            <h1 className="text-3xl font-semibold leading-tight">Welcome to HealthTwin AI</h1>
            <p className="mt-4 max-w-md text-sm text-blue-100">
              Monitor patient journeys, clinical data, and AI-driven predictions from a single, elegant dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-blue-50">
            <p className="font-semibold">Why teams choose HealthTwin</p>
            <ul className="mt-3 space-y-2 text-blue-100">
              <li>• Unified patient visibility</li>
              <li>• Faster clinical decision support</li>
              <li>• Professional, secure experience</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="metric-chip mb-4">Trusted by care teams</div>
            <h2 className="text-3xl font-semibold text-slate-900">Sign in to continue</h2>
            <p className="mt-2 text-sm text-slate-600">Access your workspace with your secure credentials.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[24px] border border-slate-200 bg-white/85 p-6 shadow-sm">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@healthcare.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
              <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Continue to dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;