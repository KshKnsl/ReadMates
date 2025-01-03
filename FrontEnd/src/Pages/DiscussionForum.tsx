import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, User, Clock } from 'lucide-react';

interface thread {
    _id: string;
    title: string;
    author: {
        _id: string;
        name: string;
    };
    createdAt: string;
    comments: string[];
}

const DiscussionForum = () => {
    const [threads, setthreads] = useState<thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchthreads = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forum/threads`);
                setthreads(response.data);
                setLoading(false);
            } 
            catch (err) 
            {
                setError('Failed to fetch threads');
                setLoading(false);
            }
        };
        fetchthreads();
    }, []);

    if (loading)
        return <div className="text-center py-10">Loading...</div>;

    if (error)
        return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-indigo-800 dark:text-amber-300 mb-6">Discussion Forum</h1>
            <Link
                to="/new-thread"
                className="inline-block mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
                Create New thread
            </Link>
            <div className="space-y-4">
                {threads.map((thread) => (
                    <motion.div
                        key={thread._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to={`/thread/${thread._id}`} className="block">
                            <h2 className="text-xl font-semibold text-indigo-700 dark:text-amber-300 mb-2">{thread.title}</h2>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                                <User size={16} className="mr-1" />
                                <span>{thread.author.name}</span>
                                <Clock size={16} className="ml-4 mr-1" />
                                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                <MessageSquare size={16} className="mr-1" />
                                <span>{thread.comments.length} comments</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DiscussionForum;
