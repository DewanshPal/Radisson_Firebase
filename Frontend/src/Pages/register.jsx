import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";


function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Registration Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // --- Validation ---
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/profile-setup"); // Redirect after successful registration
    } catch (err) {

      setError("Failed to create an account. The email may already be in use.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // SVG Icon Components
  const MailIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );

  const LockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans">
      <div className="relative flex w-full max-w-4xl flex-row overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Left Side: Branding and Image */}
        <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-tr from-green-600 to-teal-500 lg:flex">
          <div className="w-full px-8 text-center text-white">
            <h1 className="text-4xl font-bold leading-tight tracking-wider">
              Join Our Community!
            </h1>
            <p className="mt-3 text-lg font-light leading-relaxed">
              Create an account to get started on your journey with us.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-white/20 to-white/0"></div>
          <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-white/20 to-white/0"></div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full p-8 lg:w-1/2">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Create an Account
            </h2>
            <p className="mb-8 text-gray-600">Let's get you set up.</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
