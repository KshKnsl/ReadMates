import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { INTERESTS } from "../constants";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  EyeOff,
  Eye,
  Calendar,
  BookOpen,
  Pencil,
  Search,
} from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext.tsx";
import { GoogleLogin } from "@react-oauth/google";
import {motion} from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInterests = INTERESTS.filter((interest) =>
    interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleInterestToggle(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      name,
      email,
      password,
      dob,
      bio: bio || "A new User Here",
      interests,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        toast.success("Signup successful!", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        navigate("/login");
      } else {
        toast.error(`Signup failed! Please try again.${await res.text()}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };
  const { login } = useContext(AuthContext);

  const handleGoogleLogin = async (response: any) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      if (res.ok) {
        const { token, ...rest } = await res.json();
        login(token, rest.user._id, rest.user.email);
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
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
      >
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto bg-amber-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center"
          >
            <UserPlus className="h-12 w-12 text-amber-600 dark:text-amber-300 z-30" />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-amber-300">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-amber-300">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
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
              shape="pill"
              locale="en"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-amber-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300">
              or continue manually
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-amber-500 dark:text-amber-300 z-30" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-amber-300 text-gray-900 dark:text-amber-300 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-300 focus:border-transparent transition-all"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-amber-500 dark:text-amber-300 z-30" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-amber-300 text-gray-900 dark:text-amber-300 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-300 focus:border-transparent transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-amber-500 dark:text-amber-300 z-30" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-amber-300 text-gray-900 dark:text-amber-300 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-300 focus:border-transparent transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-amber-300 hover:text-gray-600 dark:hover:text-amber-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-amber-500 dark:text-amber- z-50" />
                </div>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-amber-300 text-gray-900 dark:text-amber-300 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-300 focus:border-transparent transition-all"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-30">
                <div className="absolute top-4 left-3 pointer-events-none z-30">
                  <Pencil className="h-5 w-5 text-amber-500 dark:text-amber-300 z-50" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-amber-300 text-gray-900 dark:text-amber-300 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-300 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-amber-300 mb-2">
                Select your interests
              </label>
              <div className="relative mb-2"></div>
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 z-30" />
                </div>
                <input
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-900"
                  placeholder="Search interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-48 overflow-y-auto scrollbar-hidden">
                <div className="flex flex-wrap gap-2">
                  {filteredInterests.map((interest) => (
                    <motion.button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        interests.includes(interest)
                          ? "bg-amber-100 text-amber-800 border-2 border-amber-500"
                          : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      {interest}
                    </motion.button>
                  ))}
                </div>
              </div>
              {interests.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected interests: {interests.join(", ")}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
              disabled={loading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus
                  className="h-5 w-5 text-amber-500 group-hover:text-amber-400"
                  aria-hidden="true"
                />
              </span>
              {!loading ? "Create Account" : "Loading..."}
            </button>
          </motion.div>
        </form>
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default SignUp;
