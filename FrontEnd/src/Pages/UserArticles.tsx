import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  desc: string;
  publishedAt: string;
}

interface UserArticlesProps {
  userId: string | null;
}

const UserArticles: React.FC<UserArticlesProps> = ({ userId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getArticle/author/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user articles');
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Error fetching user articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Loading articles...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (articles.length === 0) {
    return <div className="text-center py-4">No articles found.</div>;
  }

  return (
    <div className="max-w-80 flex flex-col gap-3">
      {articles.map((article) => (
        <motion.div
          key={article._id}
          className="bg-amber-50 dark:bg-gray-600 rounded-lg shadow-md overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4">
            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-2">{article.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{article.desc}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
              <Link
                to={`/article/${article._id}`}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center"
              >
                Read more
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserArticles;

