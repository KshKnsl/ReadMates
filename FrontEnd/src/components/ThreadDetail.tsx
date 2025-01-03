import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, MessageCircle } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import UserName from './ui/UserName';

interface Comment {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  comments: Comment[];
  likes: number;
}

const ThreadDetail: React.FC = () => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forum/threads/${id}`);
        setThread(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load thread. Please try again later.');
        setLoading(false);
      }
    };
    fetchThread();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/threads/${id}/comments`,
        { content: newComment, userId: auth.user?._id },
        { headers: { 'x-auth-token': token } }
      );
      setThread((prevThread) => {
        if (prevThread) 
          return { ...prevThread, comments: [...prevThread.comments, response.data] };
        return prevThread;
      });
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (!thread) 
    return (
      <div className="text-center py-10 text-indigo-800 dark:text-amber-300 text-2xl font-bold">
        Thread not found
      </div>
    );

  return (
    <div className="px-8 py-8 dark:bg-gray-800 bg-amber-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-indigo-800 rounded-lg shadow-lg p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-indigo-800 dark:text-amber-300 mb-4">{thread.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          <User size={16} className="mr-1" />
          <span className="font-medium">{thread.author.name}</span>
          <Clock size={16} className="ml-4 mr-1" />
          <span>{new Date(thread.createdAt).toLocaleString()}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">{thread.content}</p>
      </motion.div>

      <h2 className="text-2xl font-semibold text-indigo-700 dark:text-amber-300 mb-4 flex items-center">
        <MessageCircle size={24} className="mr-2" />
        Comments ({thread.comments.length})
      </h2>

      <div className='rounded-lg overflow-hidden'>
      <AnimatePresence>
        {thread.comments.map((comment) => (
            <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 px-4 py-3"
            >
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm">
              <div>
              <UserName userId={comment.author} showAvatar={true}/>
              </div>
              <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 mt-2">{comment.content}</div>
            <hr className='mt-2 border-gray-300 dark:border-gray-700'/>
            </motion.div>
        ))}
      </AnimatePresence>
      </div>
      <form onSubmit={handleCommentSubmit} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-300 dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Add a comment..."
          rows={4}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 flex items-center"
          >
            <MessageCircle size={20} className="mr-2" />
            Post Comment
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/forum"
          className="text-indigo-600 dark:text-amber-400 hover:text-indigo-800 dark:hover:text-amber-300 transition duration-300"
        >
          ← Back to Forum
        </Link>
      </div>
    </div>
  );
};

export default ThreadDetail;
