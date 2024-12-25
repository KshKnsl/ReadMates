import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserName from "../components/ui/UserName";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Search,
  Filter,
  Clock,
  ChevronUp,
  ChevronDown,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { INTERESTS as allTags } from "../constants";
import { toast, ToastContainer } from "react-toastify";

interface Article {
  source: any;
  _id: string;
  title: string;
  author: any;
  desc: string;
  content: string;
  contributors: string[];
  tags: string[];
  status: string;
  publishedAt: string;
}

function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [aiArticles, setAiArticles] = useState<Article[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/all`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredAndSortedArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => article.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.publishedAt).getTime() -
              new Date(b.publishedAt).getTime()
          : new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime();
      } else {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

  const filteredAndSortedAiArticles = aiArticles
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.publishedAt).getTime() -
              new Date(b.publishedAt).getTime()
          : new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime();
      } else {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

  const handleArticleClick = (id: string) => {
    navigate(`/article/${id}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSort = (newSortBy: "date" | "title") => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const generateAIArticles = async () => {
    setIsGenerating(true);
    if (!searchTerm) {
      toast.warn('Search term must be provided to fetch articles from external sources.');
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/article/generateAiArticle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: searchTerm,
        tags: selectedTags,
      }),
      });
      if (!response.ok) {
      throw new Error('Failed to generate articles');
      }
      const newArticles = await response.json();
      toast.info('Fetched articles from external sources was successful.');
      setAiArticles((prevArticles) => [...prevArticles, newArticles.article]);
    } catch (error) {
      console.error('Error generating articles:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-8 bg-amber-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6 text-amber-800">Articles</h1>
        <div className="mb-6 flex justify-center space-x-4">
          <Button
            onClick={() => toggleSort("date")}
            className={`flex items-center ${
              sortBy === "date"
                ? "bg-amber-500 text-white"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Date
            {sortBy === "date" &&
              (sortOrder === "asc" ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              ))}
          </Button>
          <Button
            onClick={() => toggleSort("title")}
            className={`flex items-center ${
              sortBy === "title"
                ? "bg-amber-500 text-white"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Title
            {sortBy === "title" &&
              (sortOrder === "asc" ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              ))}
          </Button>
          <Button
            onClick={generateAIArticles}
            disabled={isGenerating}
            className="flex items-center bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {isGenerating ? "Fetching..." : "Fetch from External source"}
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-amber-700">
          Filter by Tags
        </h2>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedTags.includes(tag)
                  ? "bg-amber-100 text-amber-800 border-2 border-amber-500"
                  : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
              }`}
            >
              <Filter className="w-4 h-4 inline-block mr-2" />
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className= "grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className={
            filteredAndSortedAiArticles.length > 0 ? "col-span-2": "col-span-3"}>
          <AnimatePresence>
            {filteredAndSortedArticles.length > 0 ? (
              <motion.ul className={filteredAndSortedAiArticles.length > 0 ? "grid gap-4 md:grid-cols-2 lg:grid-cols-2":"grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
                {filteredAndSortedArticles.map((article) => (
                  <motion.li
                    key={article._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleArticleClick(article._id)}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold mb-2 text-amber-900">
                      {article.title}
                    </h2>
                    {article.author ? (
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-amber-600 mr-1">By:</span>
                        <UserName userId={article.author?._id} name={article.author?.name} />
                      </div>
                    ) : article.source ? (
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-amber-600 mr-1">Source: {article.source}</span>
                      </div>
                    ) : (
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-amber-600 mr-1">Source: Gemini</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-amber-600 mt-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            ) : ("")}
          </AnimatePresence>
        </div>

        {filteredAndSortedAiArticles.length > 0 && (
          <div className={filteredAndSortedArticles.length > 0 ? "col-span-1": "col-span-3"}>
            <h2 className="text-3xl font-bold mb-6 text-amber-800 mt-10 md:mt-0">
              AI Generated Articles
            </h2>
            <AnimatePresence>
              <motion.ul className={filteredAndSortedArticles.length > 0 ? "grid gap-4":"grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
                {filteredAndSortedAiArticles.map((article) => (
                  <motion.li
                    key={article._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleArticleClick(article._id)}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold mb-2 text-amber-900">
                      {article.title}
                    </h2>
                    <p className="text-amber-700 mb-2">{article.desc}</p>
                    {article.source && (
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-amber-600 mr-1">Source: {article.source}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-amber-600 mt-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
              
            </AnimatePresence>
          </div>
          
        )}
      </div>
      
      {filteredAndSortedAiArticles.length <= 0 && filteredAndSortedArticles.length <= 0 && (
              <p
                className="text-center text-amber-700 text-lg"
              >
                No articles found matching your criteria.
              </p>
            )}
      <ToastContainer />
    </div>
  );
}

export default Articles;
