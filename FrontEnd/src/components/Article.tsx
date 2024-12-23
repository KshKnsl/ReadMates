import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
interface Article {
    title: string;
    desc: string;
    content: string;
    author: string;
    contributors: string[];
    tags: string[];
    status: string;
    publishedAt: string;
}

const Article: React.FC = () => {
    const { id } = useParams<Record<string, string | undefined>>();
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        // Fetch the article data using the id from useParams
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getArticle/${id}`);
                const data = await response.json();
                const articleData: Article = {
                    title: data.title,
                    desc: data.desc,
                    content: data.content,
                    author: data.author,
                    contributors: data.contributors,
                    tags: data.tags,
                    status: data.status,
                    publishedAt: data.publishedAt,
                };
                setArticle(articleData);
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [id]);

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.desc}</p>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
            <p>Author: {article.author}</p>
            <p>Contributors: {article.contributors.join(', ')}</p>
            <p>Tags: {article.tags.join(', ')}</p>
            <p>Status: {article.status}</p>
            <p>Published At: {article.publishedAt}</p>
        </div>
    );
};

export default Article;