import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Shield, Mail, Lock, ArrowLeft, Loader } from "lucide-react";

const AuthorityLogin = () => {

//     const AUTH_MAIL = import.meta.env.AUTH_MAIL;
// const AUTH_MAIL = import.meta.env.AUTH_MAIL;

// const [authEmail, authPassword] = AUTH_MAIL.split(":");
// const [authEmail, authPassword] = AUTH_MAIL.split(":");

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, "users", uid));
      const role = snap.exists() ? snap.data().Role : null;

      if (role !== "Authority") {
        await signOut(auth);
        setError("Access denied. This account is not marked as authority.");
        return;
      }

      navigate("/authority-dashboard");
    } catch (err) {
      let msg = err.message;
      if (err.code === "auth/user-not-found") msg = "Account not found.";
      else if (err.code === "auth/wrong-password") msg = "Incorrect password.";
      else if (err.code === "auth/invalid-email") msg = "Invalid email.";
      else if (err.code === "auth/network-request-failed") msg = "Network error. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white hover:text-[rgba(18,211,166,1)] transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="link">Back to Home</span>
        </Link>

        <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-10 h-10 text-[rgba(18,211,166,1)]" />
            <h1 className="text-3xl font-bold text-white">Authority Login</h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white mb-2 text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                placeholder="authority@example.gov"
              />
            </div>

            <div>
              <label className="text-white mb-2 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[rgba(18,211,166,1)] hover:bg-[rgba(18,211,166,0.8)] disabled:bg-gray-500 text-[rgba(2,16,42,1)] font-bold py-4 rounded-lg transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.5)] active:scale-98 mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Checking role...
                </>
              ) : (
                "Login as Authority"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Access restricted to verified authority accounts (Role = "Authority" in Firestore users collection).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorityLogin;