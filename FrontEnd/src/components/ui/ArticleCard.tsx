import React from "react";
import { motion } from "framer-motion";
import { Clock, Globe } from "lucide-react";
import UserName from "./UserName";

interface ArticleCardProps {
  article: any;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <h2 className="text-xl font-semibold mb-2 text-amber-900 dark:text-amber-300">
        {article.title}
      </h2>
      {article.author ? (
        <div className="flex items-center mb-2">
          <span className="text-sm text-amber-600 mr-1 dark:text-amber-300">
            By:
          </span>
          <UserName userId={article.author?._id} name={article.author?.name} />
        </div>
      ) : article.source ? (
        <div className="flex items-center mb-2">
          <span className="text-sm text-amber-600 mr-1 dark:text-amber-300">
            Source: {article.source}
          </span>
        </div>
      ) : (
        <div className="flex items-center mb-2">
          <span className="text-sm text-amber-600 mr-1 dark:text-amber-300">
            By: Kush Kansal
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {article.tags
          .filter(
            (tag: any) => typeof tag === "string" || typeof tag === "number"
          )
          .map((tag: string | number) => (
            <span
              key={tag}
              className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full dark:bg-amber-900 dark:text-amber-100"
            >
              {tag}
            </span>
          ))}
      </div>
      <div className="text-sm text-amber-600 mt-2 dark:text-amber-300">
        <Clock className="w-4 h-4 inline mr-2" />
        {new Date(article.publishedAt).toLocaleDateString()}
      </div>
      {article.externalUrl && (
        <div className="text-sm text-blue-600 mt-2 dark:text-blue-300">
          <Globe className="w-4 h-4 inline mr-2" />
          External Article
        </div>
      )}
    </motion.li>
  );
};

export default ArticleCard;
