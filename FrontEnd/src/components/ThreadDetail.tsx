import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Clock, MessageSquare } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  comments: Comment[];
}

const PostDetail: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forum/threads/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/threads/${id}/comments`,
        { content: newComment },
        { headers: { 'x-auth-token': token } }
      );
      setPost((prevPost) => {
        if (prevPost) {
          return { ...prevPost, comments: [...prevPost.comments, response.data] };
        }
        return prevPost;
      });
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-indigo-800 dark:text-amber-300 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          <User size={16} className="mr-1" />
          <span>{post.author.name}</span>
          <Clock size={16} className="ml-4 mr-1" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{post.content}</p>
        <h2 className="text-2xl font-semibold text-indigo-700 dark:text-amber-300 mb-4">Comments</h2>
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                <User size={14} className="mr-1" />
                <span>{comment.author.name}</span>
                <Clock size={14} className="ml-4 mr-1" />
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </motion.div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-300 dark:bg-gray-700 dark:text-white"
            placeholder="Add a comment..."
            rows={3}
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Submit Comment
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PostDetail;

