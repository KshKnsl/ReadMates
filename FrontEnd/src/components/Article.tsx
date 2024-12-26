import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Tag, Clock, User } from 'lucide-react';
import UserName from './ui/UserName';

const Article: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getArticle/${id}`);
        const temp = await response.json();
        const data = temp.article || {};
        const articleData: any = {
          title: data.title,
          desc: data.desc,
          content: data.content,
          author: data.author,
          contributors: data.contributors || [],
          tags: data.tags || [],
          status: data.status || 'Unknown status',
          publishedAt: data.publishedAt || new Date().toISOString(),
          source: data.source || null,
          sessionDocID: data.sessionDoc || null,
        };
        setArticle(articleData);
        console.log(articleData);
      } 
      catch (error) 
      {
        console.error('Error fetching article:', error);
      } 
      finally 
      {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (isLoading) 
  {
    return (
      <div className="fixed inset-0 bg-amber-50 dark:bg-gray-800 flex items-center justify-center z-50">
        <motion.div
          className="w-16 h-16 border-4 border-amber-500 dark:border-amber-300 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            borderRadius: ["50%", "25%", "50%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute text-2xl font-bold text-amber-800 dark:text-amber-300"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-800 flex items-center justify-center">
        <p className="text-2xl text-amber-800 dark:text-amber-300">Article not found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-amber-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <article className="max-w-3xl mx-auto bg-white dark:bg-gray-700 shadow-xl rounded-2xl overflow-hidden">
        <header className="bg-amber-100 dark:bg-opacity-30 p-6">
          <motion.h1
            className="text-4xl font-bold text-amber-900 dark:text-amber-300 mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {article.title}
          </motion.h1>
          <motion.p
            className="text-xl text-amber-700 dark:text-amber-300"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {article.desc}
          </motion.p>
        </header>
        <div className="p-6">
          <motion.div
            className="prose prose-amber max-w-none dark:prose-invert dark:text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
        <footer className="bg-amber-50 dark:bg-gray-800 p-6 border-t border-amber-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <motion.div
              className="flex items-center text-amber-700 dark:text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex flex-wrap gap-2 ml-2">
              <span className="font-semibold flex items-center"><Tag className="w-5 h-5 mr-2" />Tags:</span>
                {article.tags.length > 0 ? article.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-amber-200 dark:bg-opacity-30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                )) : 'None'}
              </div>
            </motion.div>
            <motion.div
              className="flex items-center text-amber-700 dark:text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="font-semibold flex items-center"><BookOpen className="w-5 h-5 mr-2" />Status:&nbsp;</span> {article.status}
            </motion.div>
            <motion.div
              className="flex items-center text-amber-700 dark:text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {article.author ? (
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <UserName userId={article.author?._id} name={article.author?.name} />
                </div>
              ) : article.source ? (
                <div className="flex items-center">
                  <span className="text-sm text-amber-700 dark:text-amber-300 mr-1">Source:&nbsp;{article.source}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-sm text-amber-700 dark:text-amber-300 mr-1">Source:&nbsp;Gemini</span>
                </div>
              )}
            </motion.div>
            <motion.div
              className="flex items-center text-amber-700 dark:text-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="font-semibold flex items-center gap-1 justify-center">
                <Clock className="w-5 h-5" />
                <div>Published:&nbsp; {new Date(article.publishedAt).toLocaleDateString()}</div>
              </div>
            </motion.div>
          </div>
        </footer>
      </article>
    </motion.div>
  );
};

export default Article;
