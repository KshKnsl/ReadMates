import { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserCircle, BookOpen, PenTool, Users, Award, Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import LanguageSelector from "./LanguageSelector";
import ThemeBtn from "./ui/ThemeBtn";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { logout } = useContext(AuthContext);

  const auth = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { to: "/Home", icon: Users, label: "Home" },
    { to: "/articles", icon: BookOpen, label: "Articles" },
    { to: "/create", icon: PenTool, label: "Create" },
    { to: "/rewards", icon: Award, label: "Rewards" },
  ];

  const menuVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: 20 }
  };

  return (
    <nav className="bg-amber-50 dark:bg-gray-800 shadow-md z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <motion.span 
                className="text-2xl font-bold text-amber-700 dark:text-amber-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                ReadMates
              </motion.span>
            </Link>
          </div>
          {!isMobile ? (
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-amber-200 text-amber-900 dark:bg-opacity-30 dark:text-amber-300"
                          : "text-amber-700 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-gray-700 dark:hover:text-amber-300"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <ThemeBtn />
              <LanguageSelector className="mr-4" />
              {!auth.user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-gray-700 dark:hover:text-amber-300 transition-colors duration-200"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Link
                      to="/signup"
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 transition-colors duration-200"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                    <Link
                      to="/profile"
                      className="p-2 rounded-full text-amber-600 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-amber-300 transition-colors duration-200"
                    >
                      <UserCircle className="w-6 h-6" />
                    </Link>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-gray-700 dark:hover:text-amber-300 transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center md:hidden">
              <motion.button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-amber-600 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:text-amber-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 dark:focus:ring-amber-300 transition-colors duration-200"
                aria-expanded={isOpen}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    variants={itemVariants}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-amber-200 text-amber-900 dark:bg-gray-700 dark:text-amber-300"
                            : "text-amber-700 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-gray-700 dark:hover:text-amber-300"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="pt-4 pb-3 border-t border-amber-200 dark:border-gray-700"
                variants={itemVariants}
                transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
              >
                <div className="flex items-center">
                  <LanguageSelector className="px-4 py-2" />
                  <ThemeBtn />
                </div>
                {!auth.user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:text-amber-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <LogIn className="w-6 h-6 mr-3" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-2 mt-1 bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-md transition-colors duration-200"
                    >
                      <UserPlus className="w-6 h-6 mr-3" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-2 mt-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:text-amber-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <UserCircle className="w-6 h-6 mr-3" />
                      <span>Your Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="flex items-center px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:text-amber-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <LogOut className="w-6 h-6 mr-3" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </nav>
  );
};

export default Navbar;