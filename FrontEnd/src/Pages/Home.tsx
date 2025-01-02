import { useState } from 'react';
import { BookOpen, Users, Lightbulb, ArrowRight, Search, Play } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import LastRead from '../components/ui/LastRead';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    navigate(`/articles/${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <LastRead />
      <main className="container mx-auto px-6 py-16 md:px-12 lg:px-24 lg:py-24">
        <section className="text-center mb-20">
          <div className="inline-flex mb-8 opacity-90">
            <BookOpen 
              size={64} 
              className="text-indigo-600 dark:text-amber-300" 
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-800 dark:text-amber-300 mb-4 tracking-tight">
            ReadMates
          </h1>
          <p className="text-xl md:text-2xl text-indigo-800/80 dark:text-amber-300 mb-12 font-normal max-w-2xl mx-auto">
            A collaborative platform for meaningful discussions, insightful reading, and knowledge sharing.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search articles, topics, or authors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-6 py-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-300 text-indigo-800 dark:text-amber-300 placeholder-indigo-400 dark:placeholder-amber-300 bg-white dark:bg-gray-700 shadow-lg text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-500 dark:bg-amber-300 text-white dark:text-gray-800 p-3 rounded-full hover:bg-indigo-600 dark:hover:bg-amber-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-amber-300 focus:ring-offset-2"
              >
                <Search size={24} />
              </button>
            </div>
          </form>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              Icon: BookOpen,
              title: "Collaborative Learning",
              description: "Engage in meaningful discussions and share insights through collaborative reading and writing."
            },
            {
              Icon: Users,
              title: "Build Connections",
              description: "Connect with professionals and peers who share your intellectual interests and goals."
            },
            {
              Icon: Lightbulb,
              title: "Explore Ideas",
              description: "Discover diverse perspectives and engage with contemporary issues through thoughtful discourse."
            }
          ].map(({ Icon, title, description }, index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-gray-700 p-8 rounded-3xl border border-indigo-50 dark:border-gray-600 hover:bg-white/90 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
            >
              <div className="bg-indigo-50 dark:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Icon 
                  className="w-8 h-8 text-indigo-600 dark:text-amber-300" 
                />
              </div>
              <h2 className="text-xl font-semibold text-indigo-900 dark:text-amber-300 mb-3">
                {title}
              </h2>
              <p className="text-indigo-800/70 dark:text-amber-300 text-base leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </section>

        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-gray-800 dark:to-gray-900 p-12 rounded-3xl shadow-2xl mb-20 overflow-hidden relative">
          <div className="absolute inset-0 bg-indigo-600 dark:bg-gray-800 opacity-90"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left lg:w-1/2">
              <h2 className="text-4xl font-bold text-white mb-6">
                Join our community of knowledge seekers
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Experience the power of collaborative learning and expand your intellectual horizons with ReadMates.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-full hover:bg-indigo-100 transition-all duration-300 group hover:shadow-lg"
              >
                Get Started
                <ArrowRight 
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                  size={20} 
                />
              </a>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
                <iframe 
                  src="https://www.youtube.com/embed/RW4HIN-XAEA?autoplay=1&loop=1&playlist=RW4HIN-XAEA&mute=1&controls=0" 
                  title="ReadMates Demo" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-[500px] h-72"
                ></iframe>
                <a href="https://www.youtube.com/watch?list=TLGGL0PZxXdLxREwMjAxMjAyNQ&v=RW4HIN-XAEA" className="absolute bottom-4 left-4 text-white flex items-center">
                  <Play className="mr-2" size={24} />
                  <span className="font-semibold">Watch Demo</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

