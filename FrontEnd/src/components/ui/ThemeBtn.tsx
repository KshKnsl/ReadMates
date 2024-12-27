import useTheme from '../../context/Theme';
import {motion} from 'framer-motion';
import {Sun, Moon} from 'lucide-react';
function ThemeBtn()
{
    const {themeMode, darkTheme, lightTheme} = useTheme();
    function handleClick()
    {
        if(themeMode=='dark')
        {
            lightTheme();
        }
        else
        {
            darkTheme();
        }
    }
    
  const variants = {
    light: { rotate: 0 },
    dark: { rotate: 360 },
  };

    return ( <motion.button
        onClick={handleClick}
        className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-700 transition-colors duration-300 ease-in-out
                   bg-amber-100 dark:bg-gray-700 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <motion.div
          variants={variants}
          animate={themeMode}
          transition={{ duration: 0.7 }}
        >
          {themeMode === 'dark' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </motion.button>
    );
};

export default ThemeBtn;