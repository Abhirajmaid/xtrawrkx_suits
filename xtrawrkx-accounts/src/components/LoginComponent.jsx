import { useState } from "react";
import { signInWithEmail, createUserWithEmail } from "../lib/auth";
import { useAuth } from "../hooks/useAuth";

const LoginComponent = () => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState("email"); // 'email', 'traditional'
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "DEVELOPER",
    department: "DEVELOPMENT",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;

      if (isRegistering) {
        result = await createUserWithEmail(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          department: formData.department,
        });
      } else {
        result = await signInWithEmail(formData.email, formData.password);
      }

      await login(result.user, result.token);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegistering ? "Register" : "Login"} - Xtrawrkx Accounts
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Auth Mode Selector */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setAuthMode("email")}
            className={`px-3 py-1 text-sm rounded ${
              authMode === "email" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setAuthMode("traditional")}
            className={`px-3 py-1 text-sm rounded ${
              authMode === "traditional"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Internal
          </button>
        </div>
      </div>

      {/* Email Authentication Form */}
      {authMode === "email" && (
        <form onSubmit={handleEmailAuth}>
          {isRegistering && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DEVELOPER">Developer</option>
                  <option value="DESIGNER">Designer</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="SALES_REP">Sales Rep</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>
      )}

      {/* Traditional Login Form */}
      {authMode === "traditional" && (
        <form onSubmit={handleEmailAuth}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Login (Internal)"}
          </button>
        </form>
      )}

      {/* Toggle Register/Login */}
      {authMode !== "traditional" && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:underline"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
