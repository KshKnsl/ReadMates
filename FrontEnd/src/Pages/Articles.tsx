import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Article 
{
  _id: string;
  title: string;
  author: string;
  desc: string;
  content: string;
  contributors: string[];
  tags: string[];
  status: string;
  publishedAt: string;
}

function Articles() 
{
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try 
      {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/getArticle/all`; 
        const response = await fetch(url);
        const data = await response.json();
        setArticles(data.articles || []);
      } 
      catch (error) 
      {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []); 

  const handleArticleClick = (id: string) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <div>
        <ul className="list-none">
          {articles.map((article) => (
            <li key={article._id} className="mb-2" onClick={() => handleArticleClick(article._id)}> 
              <div className="p-4 bg-gray-100 rounded-md cursor-pointer">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p>{(article.author)?`By ${article.author}`:""}</p> 
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Articles;