import { useState } from 'react';
import { BookOpen, Users, Lightbulb, ArrowRight, Search } from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsSearchFocused] = useState(false);

  const handleSearch = (e:any) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-800">
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

        <section className="bg-white/70 dark:bg-gray-700 p-12 rounded-3xl border border-indigo-50 dark:border-gray-600 text-center">
          <h2 className="text-3xl font-semibold text-indigo-900 dark:text-amber-300 mb-8">
            Join our community of knowledge seekers
          </h2>
          <a
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 dark:bg-amber-300 text-white dark:text-gray-800 text-base font-medium rounded-2xl hover:bg-indigo-700 dark:hover:bg-amber-200 transition-all duration-300 group hover:shadow-lg"
          >
            Get Started
            <ArrowRight 
              className="ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform duration-300" 
              size={18} 
            />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;