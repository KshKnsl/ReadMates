import useTheme from '../../context/Theme';
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
    return (
        <button
            onClick={handleClick}
            className="p-2 rounded-full focus:outline-none transition-colors duration-300 ease-in-out
                                 bg-amber-50 dark:bg-gray-800 text-gray-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-700"
        >
            {themeMode=='dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
    );
};

export default ThemeBtn;