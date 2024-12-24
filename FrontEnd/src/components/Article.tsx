import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Tag, Clock } from 'lucide-react';

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
          title: data.title || 'No title available',
          desc: data.desc || 'No description available',
          content: data.content || '<p>No content available</p>',
          author: data.author || 'Unknown author',
          contributors: data.contributors || [],
          tags: data.tags || [],
          status: data.status || 'Unknown status',
          publishedAt: data.publishedAt || new Date().toISOString(),
        };
        setArticle(articleData);
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
      <div className="fixed inset-0 bg-amber-50 flex items-center justify-center z-50">
        <motion.div
          className="w-16 h-16 border-4 border-amber-500 rounded-full"
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
          className="absolute text-2xl font-bold text-amber-800"
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
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-2xl text-amber-800">Article not found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <article className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <header className="bg-amber-100 p-6">
          <motion.h1
            className="text-4xl font-bold text-amber-900 mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {article.title}
          </motion.h1>
          <motion.p
            className="text-xl text-amber-700"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {article.desc}
          </motion.p>
        </header>
        <div className="p-6">
          <motion.div
            className="prose prose-amber max-w-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
         <footer className="bg-amber-50 p-6 border-t border-amber-100">
          <div className="flex flex-wrap gap-4">
            <motion.div
              className="flex items-center text-amber-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Tag className="w-5 h-5 mr-2" />
              <span className="font-semibold">Tags:</span>
              <div className="flex flex-wrap gap-2 ml-2">
                {article.tags.length > 0 ? article.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                )) : 'None'}
              </div>
            </motion.div>
            <motion.div
              className="flex items-center text-amber-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="font-semibold">Status:</span> {article.status}
            </motion.div>
            
            <motion.div
              className="flex items-center text-amber-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-semibold">Published:</span> {new Date(article.publishedAt).toLocaleDateString()}
            </motion.div>
          </div>
        </footer> 
      </article>
    </motion.div>
  );
};

export default Article;
