import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ScanFace, EyeOff, Eye } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext.tsx";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = { email, password };
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        toast.error("Invalid Credentials");
        // console.log(res);
      }
      if (res.ok) {
        const { token, rest } = await res.json();
        login(token, rest._doc._id);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 4000,
        });
        navigate("/profile");
      }
    } catch (err) {
      console.error(err); // Log the error to console
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      // console.log(response);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      if (res.ok) {
        const { token, ...rest } = await res.json();
        // console.log(rest);
        login(token, rest.user._id);
        toast.success("Google login successful!", {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        toast.error(
          `Google login failed. Please try again.${await res.text()}`,
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
      }
    } catch (error) {
      toast.error("An error occurred during Google login.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <ScanFace className="mx-auto h-24 w-auto text-amber-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-900">
            Log in to ReadMates
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
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() =>
                  toast.error("Google login failed. Please try again.", {
                    position: "top-right",
                    autoClose: 4000,
                  })
                }
                type="standard"
                theme="filled_black"
                size="large"
                text="signin_with"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
