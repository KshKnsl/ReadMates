import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserCircle, BookOpen, PenTool, Users, Award, Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  
  const auth = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { to: "/articles", icon: BookOpen, label: "Articles" },
    { to: "/create", icon: PenTool, label: "Create" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/rewards", icon: Award, label: "Rewards" },
  ];

  return (
    <nav className="bg-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-amber-700">ReadMates</span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-amber-200 text-amber-900'
                      : 'text-amber-700 hover:bg-amber-100 hover:text-amber-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!auth.user ? (<>
            <Link
              to="/login"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors duration-200"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-200"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up
            </Link></>):(<>
            <Link
              to="/profile"
              className="p-2 rounded-full text-amber-600 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
            >
              <UserCircle className="w-6 h-6" />
            </Link>
            <button
              onClick={() => {logout()}}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button></>)
            }
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-600 hover:text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-amber-200 text-amber-900'
                    : 'text-amber-700 hover:bg-amber-100 hover:text-amber-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-amber-200">
        {!auth.user ? (<>
          <Link
            to="/login"
            className="flex items-center px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-md transition-colors duration-200"
          >
            <LogIn className="w-6 h-6 mr-3" />
            <span>Login</span>
          </Link>
          <Link
            to="/signup"
            className="flex items-center px-4 py-2 mt-1 bg-amber-500 text-white hover:bg-amber-600 rounded-md transition-colors duration-200"
          >
            <UserPlus className="w-6 h-6 mr-3" />
            <span>Sign Up</span>
          </Link>
          </>):(<>
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 mt-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-md transition-colors duration-200"
          >
            <UserCircle className="w-6 h-6 mr-3" />
            <span>Your Profile</span>
          </Link>
            <button
              onClick={() => {logout()}}
            className="flex items-center px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-md transition-colors duration-200"
          >
            <LogOut className="w-6 h-6 mr-3" />
            <span>Logout</span>
          </button>
          </>)
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

