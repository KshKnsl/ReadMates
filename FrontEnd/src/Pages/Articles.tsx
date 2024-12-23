import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Article {
  [x: string]: any;
  title: string;
  author: string;
  // Add other properties as needed
}

function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState({
    tag: '',
    author: '',
    title: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/all`; 

        // if (filters.tag) {
        //   url = `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/tags/${filters.tag}`;
        // } else if (filters.author) {
        //   url = `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/author/${filters.author}`;
        // } else if (filters.title) {
        //   url = `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/title/${filters.title}`;
        // }
        
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [filters]); 

  const handleFilterChange = (event: { target: { name: string; value: string; }; }) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleArticleClick = (id: string) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>

      {/* Filter Section */}
      <div className="mb-4">
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
          Tag:
        </label>
        <input
          type="text"
          id="tag"
          name="tag"
          value={filters.tag}
          onChange={handleFilterChange}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />

        <label htmlFor="author" className="block mt-4 text-sm font-medium text-gray-700">
          Author:
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={filters.author}
          onChange={handleFilterChange}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />

        <label htmlFor="title" className="block mt-4 text-sm font-medium text-gray-700">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {/* Article List */}
      <div>
        <ul className="list-none">
          {articles?.map((article) => (
            <li key={article?._id} className="mb-2" onClick={() => handleArticleClick(article?._id)}> 
              <div className="p-4 bg-gray-100 rounded-md cursor-pointer">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p>By {article.author}</p> 
                {/* Display other article details as needed */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Articles;