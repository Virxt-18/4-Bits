import { useState } from "react";
import { Shield, ArrowLeft, User, Phone, Mail, MapPin, CreditCard, Upload, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [view, setView] = useState("options"); // "options", "login", "register"
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
    idType: "",
    idNumber: "",
    destination: "",
    idDocument: null,
  });

  const idTypes = [
    "Passport",
    "Aadhaar Card",
    "Driving License",
    "Voter ID",
    "PAN Card",
    "Other Government ID"
  ];

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      idDocument: file
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", loginData);
    alert("Login successful!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registration submitted:", formData);
    alert("Registration submitted successfully!");
  };
// Options View
  if (view === "options") {
    return (
      <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white hover:text-[rgba(18,211,166,1)] transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          {/* Options Card */}
          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Shield className="w-10 h-10 text-[rgba(18,211,166,1)]" />
              <h1 className="text-3xl font-bold text-gradient nb">Welcome</h1>
            </div>

            <p className="text-center text-white text-lg mb-8">
              Choose an option to continue
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Login Option */}
              <button
                onClick={() => setView("login")}
                className="group bg-[rgba(2,16,42,0.8)] border-2 border-[rgba(18,211,166,0.3)] hover:border-[rgba(18,211,166,1)] rounded-xl p-8 transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.3)] cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[rgba(18,211,166,0.2)] p-4 rounded-full group-hover:bg-[rgba(18,211,166,0.3)] transition">
                    <LogIn className="w-12 h-12 text-[rgba(18,211,166,1)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Login</h2>
                  <p className="text-gray-400 text-center">
                    Already have an account? Sign in with your credentials
                  </p>
                </div>
              </button>

              {/* Register Option */}
              <button
                onClick={() => setView("register")}
                className="group bg-[rgba(2,16,42,0.8)] border-2 border-[rgba(18,211,166,0.3)] hover:border-[rgba(18,211,166,1)] rounded-xl p-8 transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.3)] cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[rgba(18,211,166,0.2)] p-4 rounded-full group-hover:bg-[rgba(18,211,166,0.3)] transition">
                    <UserPlus className="w-12 h-12 text-[rgba(18,211,166,1)]" />
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
          {/* Back button */}
          <button
            onClick={() => setView("options")}
            className="inline-flex items-center gap-2 text-white hover:text-[rgba(18,211,166,1)] transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
assword */
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Confirm your password"
                />
              </div>

              {/* P
          {/* Login Card */}
          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <LogIn className="w-10 h-10 text-[rgba(18,211,166,1)]" />
              <h1 className="text-3xl font-bold text-gradient nb">Login</h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[rgba(18,211,166,1)] hover:bg-[rgba(18,211,166,0.8)] text-[rgba(2,16,42,1)] font-bold py-4 rounded-lg transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.5)] active:scale-98 mt-6"
              >
                Login
              </button>

              {/* Register Link */}
              <p className="text-center text-gray-400 text-sm mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-[rgba(18,211,166,1)] hover:underline"
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
        {/* Back button */}
        <button
          onClick={() => setView("options")}
          className="inline-flex items-center gap-2 text-white hover:text-[rgba(18,211,166,1)] transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Registration Card */}
        <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-10 h-10 text-[rgba(18,211,166,1)]" />
            <h1 className="text-3xl font-bold text-gradient nb">Tourist Registration</h1>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[rgba(18,211,166,1)]" />
                Personal Information
              </h2>

              {/* Name */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium">Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  required
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your nationality"
                />
              </div>
            </div>

            {/* ID Information */}
            <div className="space-y-4 pt-4 border-t border-[rgba(18,211,166,0.2)]">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[rgba(18,211,166,1)]" />
                ID Information
              </h2>

              {/* ID Type */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium">ID Type *</label>
                <select
                  name="idType"
                  required
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition cursor-pointer"
                >
                  <option value="">Select ID Type</option>
                  {idTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium">ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  required
                  value={formData.idNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                  placeholder="Enter your ID number"
                />
              </div>

              {/* Upload ID Document */}
              <div>
                <label className="block text-white mb-2 text-sm font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload ID Document *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[rgba(18,211,166,0.2)] file:text-[rgba(18,211,166,1)] hover:file:bg-[rgba(18,211,166,0.3)] cursor-pointer"
                  />
                </div>
                {formData.idDocument && (
                  <p className="text-sm text-[rgba(18,211,166,1)] mt-2">
                    Selected: {formData.idDocument.name}
                  </p>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="pt-4 border-t border-[rgba(18,211,166,0.2)]">
              <label className="block text-white mb-2 text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination in Northeast India *
              </label>
              <input
                type="text"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg text-white focus:outline-none focus:border-[rgba(18,211,166,1)] transition"
                placeholder="e.g., Gangtok, Shillong, Guwahati"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[rgba(18,211,166,1)] hover:bg-[rgba(18,211,166,0.8)] text-[rgba(2,16,42,1)] font-bold py-4 rounded-lg transition duration-200 hover:shadow-[0_0_20px_rgba(18,211,166,0.5)] active:scale-98 mt-6"
            >
              Complete Registration
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[rgba(18,211,166,1)] hover:underline"
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
