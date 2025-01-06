import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Tag, Clock, User, Brain, Loader2 } from "lucide-react";
import UserName from "./ui/UserName";
import Call from "../Pages/Call";
import {Button} from "./ui/button";
import {ToastContainer} from 'react-toastify'
import { AuthContext } from "../context/AuthContext";

const Article: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizUrl, setQuizUrl] = useState<string | null>();
  const [quizLoading, setQuizLoading] = useState(false);
  const auth = React.useContext(AuthContext);
  useEffect(() => 
  {
    const updateReadingStatus = async () => {
      if(auth?.user?._id) {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/reading`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ articleId: id, userId: auth?.user?._id }),
        });
      }
    };
    updateReadingStatus();
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/${id}`
        );
        const temp = await response.json();
        const data = temp.article || {};
        const articleData: any = {
          title: data.title,
          desc: data.desc,
          content: data.content,
          author: data.author,
          contributors: data.contributors || [],
          tags: data.tags || [],
          status: data.status || "Unknown status",
          publishedAt: data.publishedAt || new Date().toISOString(),
          source: data.source || null,
          sessionDocID: data.sessionDoc || null,
        };
        setArticle(articleData);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
    
  }, [id]);

  const fetchQuiz = async () => { 
    setQuizLoading(true);
    const contentContainer = document.querySelector('.content-Container');
    const content = contentContainer ? contentContainer.textContent : '';
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL2}/api/fetch-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: article.title, content: content }),
      
      });
      const data = await response.json();
      setQuizUrl(data.quizCode);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setQuizLoading(false);
    }
  };

  if (isLoading) {
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
        <p className="text-2xl text-amber-800 dark:text-amber-300">
          Article not found
        </p>
      </div>
    );
  }
  return (
    <>
      <motion.div
        className="min-h-screen bg-amber-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex gap-6 flex-col md:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <article className="max-w-5xl mx-auto bg-white dark:bg-gray-700 shadow-xl rounded-2xl overflow-hidden">
          <header className="bg-amber-100 dark:bg-opacity-30 p-6">
            <motion.h1
              className="text-4xl font-bold text-amber-900 dark:text-amber-300 mb-4"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              {!quizUrl ?(
              <Button
                onClick={fetchQuiz}
                disabled={quizLoading}
                className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
              >
                {quizLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                {quizLoading ? "Making Quiz (It may take few sec)..." : "Take a Quiz to test your Knowledge"}
              </Button>):(
                    <a
                    target="_blank"
                    href={`https://chintan.42web.io/QuizArea.php?code=${quizUrl}`}
                    className="rounded-lg bg-amber-500 text-white p-4"
                    title="Quiz"
                    style={{ textDecoration: 'none' }}
                    >
                    Start The Quiz
                    </a>
              )}
            </motion.div>
          </header>
          <div className="p-6 content-Container">
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
                  <span className="font-semibold flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags:
                  </span>
                  {article.tags.length > 0
                    ? article.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-amber-200 dark:bg-opacity-30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))
                    : "None"}
                </div>
              </motion.div>
              <motion.div
                className="flex items-center text-amber-700 dark:text-amber-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Status:&nbsp;
                </span>
                <span className="bg-amber-100 dark:bg-opacity-30 px-3 py-1 rounded-full">
                  {article.status}
                </span>
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
                    <UserName
                      userId={article.author?._id}
                      name={article.author?.name}
                    />
                  </div>
                ) : article.source ? (
                  <div className="flex items-center">
                    <span className="text-sm text-amber-700 dark:text-amber-300 mr-1">
                      Source:&nbsp;{article.source}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm text-amber-700 dark:text-amber-300 mr-1">
                      Source:&nbsp;Not Known
                    </span>
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
                  <div>
                    Published:&nbsp;
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            </div>
          </footer>
        </article>
        <div className="max-w-fit">
          <Call />
        </div>
        <ToastContainer />
      </motion.div>
    </>
  );
};

export default Article;
