import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ScanFace,
  EyeOff,
  Eye,
  AlertCircle,
  Github,
  Twitter,
} from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock login logic
      if (email === "user@example.com" && password === "password") {
        console.log("Login successful");
        // Here you would typically set user state and redirect
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <ScanFace className="mx-auto h-24 w-auto text-amber-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-900">
            Sign in to ReadMates
          </h2>
          <p className="mt-2 text-center text-sm text-amber-700">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-amber-600 hover:text-amber-500 transition-colors duration-300"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-500" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-amber-300 placeholder-amber-500 text-amber-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-500" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border border-amber-300 placeholder-amber-500 text-amber-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-amber-500 hover:text-amber-600 focus:outline-none focus:text-amber-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-amber-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/signup"
                className="font-medium text-amber-600 hover:text-amber-500 transition-colors duration-300"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300"
              disabled={isLoading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn
                  className="h-5 w-5 text-amber-500 group-hover:text-amber-400"
                  aria-hidden="true"
                />
              </span>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-amber-700">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-6">
            <div className="w-full">
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-amber-300 rounded-md shadow-sm bg-white text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l5.9-5.9C34.7 3.5 29.9 1.5 24 1.5 14.8 1.5 7.3 7.9 4.7 16.1l6.9 5.4C13.1 15.1 18 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.2-2.5 5.9-5.2 7.7l6.9 5.4c4-3.7 6.3-9.1 6.3-15.6z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.6 28.5c-1-3.2-1-6.8 0-10l-6.9-5.4c-2.5 5.1-2.5 11.3 0 16.4l6.9-5.4z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 46.5c5.9 0 10.7-1.9 14.3-5.2l-6.9-5.4c-2 1.4-4.5 2.2-7.4 2.2-6 0-10.9-4.1-12.7-9.6l-6.9 5.4c3.6 7.2 10.9 12.6 19.6 12.6z"
                  />
                </svg>
                <span className="sr-only">Sign in with Google</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
