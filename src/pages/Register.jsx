import { useState } from "react";
import { Shield, ArrowLeft, User, Phone, Mail, MapPin, LogIn, UserPlus, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("options"); // "options", "login", "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    password: "",
    confirmPassword: "",
    destination: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log("Starting login process for:", loginData.email);
    
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      console.log("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = err.message;
      
      // Provide more user-friendly error messages
      if (err.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please register first.";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    console.log("Starting registration process...");
    console.log("Form data:", { ...formData, password: "***", confirmPassword: "***" });
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Creating user with email:", formData.email);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      console.log("User created with UID:", uid);

      console.log("Saving user profile to Firestore...");
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        destination: formData.destination,
        createdAt: serverTimestamp(),
      };
      console.log("Profile data to save:", profileData);
      
      await setDoc(doc(db, "users", uid), profileData);

      console.log("Registration successful and profile saved!");
      setSuccess("Registration successful! Redirecting to dashboard...");
      alert("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = err.message;
      
      // Provide more user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please login instead.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Options View
  if (view === "options") {
    return (
      <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white hover:text-[#12c0d3] transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="link hover:text-[#12c0d3]">Back to Home</span>
          </Link>

          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,204,211,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Shield className="w-10 h-10 text-[#12c0d3]" />
              <h1 className="text-3xl font-bold text-white">Welcome</h1>
            </div>

            <p className="text-center text-white text-lg mb-8">
              Choose an option to continue
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setView("login")}
                className="group bg-[rgba(2,16,42,0.8)] border-2 border-[rgba(18,166,211,0.3)] hover:border-[#12c6d3] rounded-xl p-8 transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.3)] cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[rgba(18,211,166,0.2)] p-4 rounded-full group-hover:bg-[rgba(18,195,211,0.3)] transition">
                    <LogIn className="w-12 h-12 text-[#12c0d3]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Login</h2>
                  <p className="text-gray-400 text-center">
                    Already have an account? Sign in with your credentials
                  </p>
                </div>
              </button>

              <button
                onClick={() => setView("register")}
                className="group bg-[rgba(2,16,42,0.8)] border-2 border-[rgba(18,198,211,0.3)] hover:border-[#12ccd3] rounded-xl p-8 transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.3)] cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[rgba(18,211,166,0.2)] p-4 rounded-full group-hover:bg-[rgba(18,195,211,0.3)] transition">
                    <UserPlus className="w-12 h-12 text-[#12c0d3]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Register</h2>
                  <p className="text-gray-400 text-center">
                    New user? Create an account and get your Digital Tourist ID
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login View
  if (view === "login") {
    return (
      <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => setView("options")}
            className="inline-flex items-center gap-2 text-white hover:text-[#12c0d3] transition mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="link">Back</span>
          </button>

          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,176,211,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <div className="flex items-center justify-center gap-3 mb-8">
              <LogIn className="w-10 h-10 text-[#12c0d3]" />
              <h1 className="text-3xl font-bold text-white">Login</h1>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className=" text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,188,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,195,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#12c0d3] hover:bg-[#12c0d3] disabled:bg-gray-500 text-[rgba(2,16,42,1)] font-bold py-4 rounded-lg transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.5)] active:scale-98 mt-6 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-[#12c0d3] hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Registration View
  return (
    <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => setView("options")}
          className="inline-flex items-center gap-2 text-white hover:text-[#12c0d3] transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="link">Back</span>
        </button>

        <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,188,211,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-10 h-10 text-[#12c0d3]" />
            <h1 className="text-3xl font-bold text-white">Tourist Registration</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/15 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#12c0d3]" />
                Personal Information
              </h2>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,188,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,198,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,198,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,188,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <label className="text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,204,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-white mb-2 text-sm font-medium">Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  required
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,204,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                  placeholder="Enter your nationality"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[rgba(18,201,211,0.2)]">
              <label className="text-white mb-2 text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination in Northeast India *
              </label>
              <input
                type="text"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,208,211,0.3)] rounded-lg text-white focus:outline-none focus:border-[#12c0d3] transition"
                placeholder="e.g., Gangtok, Shillong, Guwahati"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#12c0d3] hover:bg-[#12c0d3] disabled:bg-gray-500 text-[rgba(2,16,42,1)] font-bold py-4 rounded-lg transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.5)] active:scale-98 mt-6 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[#12c0d3] hover:underline cursor-pointer"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;