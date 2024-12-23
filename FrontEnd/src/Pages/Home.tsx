import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Users, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-indigo-50">
      <main className="container mx-auto px-6 py-16 md:px-12 lg:px-24 lg:py-24">
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <BookOpen size={64} className="text-indigo-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-800 mb-4 tracking-tight">
            ReadMates
          </h1>
          <p className="text-xl md:text-2xl text-indigo-700 mb-8 font-light">
            Collaborative learning for the digital age
          </p>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Explore articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-800 placeholder-indigo-400 bg-white shadow-lg text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                <Search size={24} />
              </button>
            </div>
          </form>
        </motion.section>

        <motion.section
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="bg-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-16 h-16 text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
              Collaborative Learning
            </h2>
            <p className="text-indigo-700 text-lg">
              Read and write articles with friends, making learning a social and engaging experience.
            </p>
          </motion.div>
          <motion.div
            className="bg-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-16 h-16 text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
              Build Connections
            </h2>
            <p className="text-indigo-700 text-lg">
              Connect with like-minded peers and expand your knowledge together.
            </p>
          </motion.div>
          <motion.div
            className="bg-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lightbulb className="w-16 h-16 text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
              Tackle Youth Issues
            </h2>
            <p className="text-indigo-700 text-lg">
              Explore and discuss important topics affecting young people today.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          className="text-center bg-amber-50 p-12 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-indigo-800 mb-6">
            Ready to start your learning journey?
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-indigo-500 text-white text-xl font-semibold rounded-full hover:bg-indigo-600 transition duration-300 shadow-md hover:shadow-lg"
            >
              Join ReadMates
              <ArrowRight className="ml-2" size={24} />
            </Link>
          </motion.div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
