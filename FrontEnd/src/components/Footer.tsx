import { useEffect, useState } from "react";

const Footer = () => {
  const [quote, setQuote] = useState("Loading...");
  const [author, setAuthor] = useState("");
  const [showQuote, setShowQuote] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewQuote = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://api.quotable.io/random?maxLength=100"
      );
      const data = await response.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("The best preparation for tomorrow is doing your best today.");
      setAuthor("H. Jackson Brown Jr.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuote();
    const interval = setInterval(() => {
      setShowQuote((prev) => !prev);
      if (!showQuote)
        fetchNewQuote();
    }, 5000);
    return () => clearInterval(interval);
  }, [showQuote]);

  return (
    <footer
      className={`w-full shadow-lg py-3 px-4`}
    >
      <div
        className={`max-w-7xl mx-auto transition-transform duration-500`}
      >
        <div className="relative h-8 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-6 h-6 bg-amber-200 rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-4 h-4 bg-indigo-200 rounded-full animate-bounce" />
          </div>

          <div
            className={`transform transition-all duration-700 ease-in-out ${
              showQuote
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <p
                className={`text-sm md:text-base font-light text-center bg-gradient-to-r from-amber-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 ${
                  isLoading ? "animate-pulse" : ""
                }`}
              >
                "{quote}"
              </p>
              <span className="text-xs md:text-sm font-medium text-amber-600/80 hover:text-indigo-600/90 transition-colors duration-300">
                — {author}
              </span>
            </div>
          </div>

          <div
            className={`absolute top-0 left-0 w-full transform transition-all duration-700 ease-in-out ${
              !showQuote
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div className="flex items-center justify-center gap-4">
              <p className="text-xs md:text-sm text-amber-600/90 hover:text-indigo-600/80 transition-colors duration-300">
                © {new Date().getFullYear()} All Rights Reserved
              </p>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-amber-600/90">Made with </span>
                <span className="animate-bounce inline-block text-amber-500">
                  ⚡
                </span>
                <span className="text-xs text-indigo-600/90">by </span>
                <a href="https://linkedin.in/in/kushkansal" className="text-xs font-medium bg-gradient-to-r from-amber-600 to-indigo-600 bg-clip-text text-transparent hover:scale-110 transition-all duration-300 cursor-pointer">
                  Kush Kansal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;