import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const LastRead = () => {
  const [lastRead, setLastRead] = useState<{
    _id: any; title: string 
} | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const getLastRead = async () => {
      if (auth?.user?._id) 
      {
        try 
        { 
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${auth.user._id}`);
          const data = await response.json();
          setLastRead(data.lastRead);
          setIsVisible(true);
        } 
        catch (error) 
        {
          console.error("Error fetching last read:", error);
          setLastRead(null);
          setIsVisible(false);
        }
      }
    };
    getLastRead();
  }, [auth?.user?._id]);
  if (!auth.user || !lastRead)  return null;
  return (<AnimatePresence>
    {isVisible && (
        <motion.div 
            className="flex justify-center items-center w-full fixed z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                className="bg-white dark:bg-indigo-900 shadow-md rounded-full overflow-hidden flex items-center justify-between"
                initial={{ width: 0, height: 40 }}
                animate={{ 
                    width: 'auto',
                    height: 40,
                    transition: { 
                        width: { type: "spring", stiffness: 300, damping: 30 },
                        height: { duration: 0 }
                    }
                }}
                exit={{ 
                    width: 0,
                    transition: { 
                        width: { type: "spring", stiffness: 300, damping: 30 },
                        height: { duration: 0 }
                    }
                }}
            >
                <motion.div 
                    className="flex items-center justify-between w-full px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to={`/article/${lastRead?._id}`} className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Continue reading: {lastRead?.title.slice(0, 50)}{lastRead?.title.length > 15 ? '...' : ''}
                    </Link>
                    <motion.button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none ml-2"
                        aria-label="Close"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={18} />
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>);
};

export default LastRead;
