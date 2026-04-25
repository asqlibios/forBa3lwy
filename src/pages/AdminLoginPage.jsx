import { useState } from "react";

export default function AdminLoginPage({
  onLogin,
  onBack,
  isCheckingAuth = false,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your admin email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onLogin(email.trim(), password);
    } catch (loginError) {
      console.error("Admin sign-in failed:", loginError);
      setError("Login failed. Check the admin account details in Firebase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Back to Shop
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400 mb-4">
            Admin Access
          </p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            Sign in to manage products in Firebase.
          </h1>
          <p className="text-gray-300 mt-5 max-w-xl leading-7">
            This login is only for store admins. After signing in, you can add,
            edit, and delete products directly from the dashboard.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              Protected admin area
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              Firebase email login
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              Product control panel
            </div>
          </div>
        </div>

        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-7 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500">Admin Login</p>
            <h2 className="text-2xl font-black mt-1">Welcome back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isCheckingAuth}
              className="w-full rounded-2xl bg-black text-white py-3.5 font-bold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting || isCheckingAuth ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
