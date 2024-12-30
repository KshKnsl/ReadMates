import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import Footer from "../components/Footer";
import ArticleCard from "../components/ui/ArticleCard";

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
  const SearchParam = useParams();
  const [searchTerm, setSearchTerm] = useState(SearchParam.q || "");
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
      <div className="flex justify-center items-center h-screen bg-amber-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (<>
    <div className="mx-auto p-8 bg-amber-50 dark:bg-gray-800 min-h-screen items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold mb-6 text-amber-800 dark:text-amber-300">Articles</h1>
        <div className="mb-6 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Button
        onClick={() => toggleSort("date")}
        className={`flex items-center ${
          sortBy === "date"
            ? "bg-amber-500 text-white"
            : "bg-amber-100 text-amber-800 dark:bg-gray-700 dark:text-amber-300"
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
            : "bg-amber-100 text-amber-800 dark:bg-gray-700 dark:text-amber-300"
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
            className="pl-10 pr-4 py-2 w-full border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-amber-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 dark:text-amber-300" />
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-amber-700 dark:text-amber-300">
          Filter by Tags
        </h2>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto  scrollbar-hidden">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedTags.includes(tag)
                  ? "bg-amber-100 text-amber-800 border-2 border-amber-500 dark:bg-gray-700 dark:text-amber-300 dark:border-amber-300"
                  : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300 dark:bg-gray-700 dark:text-amber-300 dark:hover:border-gray-600"
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
                  <ArticleCard
                    key={article._id}
                    article={article}
                    onClick={() => handleArticleClick(article._id)}
                  />
                ))}
              </motion.ul>
            ) : ("")}
          </AnimatePresence>
        </div>

        {filteredAndSortedAiArticles.length > 0 && (
          <div className={filteredAndSortedArticles.length > 0 ? "col-span-1": "col-span-3"}>
            <h2 className="text-3xl font-bold mb-6 text-amber-800 mt-10 md:mt-0 dark:text-amber-300">
              AI Generated Articles
            </h2>
            <AnimatePresence>
              <motion.ul className={filteredAndSortedArticles.length > 0 ? "grid gap-4":"grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
                {filteredAndSortedAiArticles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    onClick={() => handleArticleClick(article._id)}
                  />
                ))}
              </motion.ul>
              
            </AnimatePresence>
          </div>
          
        )}
      </div>
      
      {filteredAndSortedAiArticles.length <= 0 && filteredAndSortedArticles.length <= 0 && (
              <p
                className="text-center text-amber-700 text-lg dark:text-amber-300"
              >
                No articles found matching your criteria.
              </p>
            )}
      <ToastContainer />
    </div>
      <Footer /></>
  );
}

export default Articles;
