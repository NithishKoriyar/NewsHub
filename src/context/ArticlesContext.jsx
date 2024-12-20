import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// API Configuration
const API_CONFIG = {
    newsApi: {
        url: (keyword) => `https://newsapi.org/v2/everything?q=${keyword}&apiKey=68008431ecca4451a586717f5ca325c2`,
    },
    guardianApi: {
        url: (keyword) => `https://content.guardianapis.com/search?q=${keyword}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`,
    },
    worldNewsApi: {
        url: (keyword) =>
            `https://api.worldnewsapi.com/top-news?source-country=in&language=en&date=2024-09-29&q=${keyword}`,
        headers: { 'x-api-key': '0e514196a5254092b39346db9028116e' },
    },
};

// Context Creation
// eslint-disable-next-line react-refresh/only-export-components
export const ArticlesContext = createContext();

// Utility Functions
const fetchFromApi = async (url, headers = {}) => {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
};

const normalizeArticles = (apiType, data) => {
    switch (apiType) {
        case 'newsApi':
            return (
                data?.articles
                    ?.filter((article) => article.source?.name !== '[Removed]') // Exclude unwanted articles
                    .map((article) => ({
                        title: article.title || 'No Title',
                        description: article.description || 'No Description',
                        date: article.publishedAt || 'No Date',
                        url: article.url || '#',
                        source: article.source?.name || 'Unknown',
                        author: article.author || 'Unknown',
                        category: 'General',
                        image: article.urlToImage || null, // Normalize image data
                    }))
                    ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [] // Sort by date
            );

        case 'guardianApi':
            return (
                data.response?.results?.map((result) => ({
                    title: result.webTitle || 'No Title',
                    description: result.fields?.trailText || 'No Description',
                    date: result.webPublicationDate || 'No Date',
                    url: result.webUrl || '#',
                    source: 'The Guardian',
                    author: 'Unknown', // Guardian API doesn't include author data
                    category: result.sectionName || 'General',
                    image: null, // No image data available
                }))
                    ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [] // Sort by date
            );

        case 'worldNewsApi':
            return (
                data?.top_news?.flatMap((category) =>
                    category.news.map((article) => ({
                        title: article.title || 'No Title',
                        description: article.text || 'No Description',
                        date: article.publish_date || 'No Date',
                        url: article.url || '#',
                        source: article.source || 'Unknown',
                        author: article.author || 'Unknown',
                        category: category.language || 'General',
                        image: article.image || null, // Normalize image data
                    }))
                )
                    ?.sort((a, b) => new Date(b.date) - new Date(a.date)) || [] // Sort by date
            );

        default:
            return [];
    }
};


// Provider Component
const ArticlesProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        keyword: 'all',
        category: '',
        source: '',
        author: '',
        startDate: '',
        endDate: '',
    });

    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const [authors, setAuthors] = useState([]);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const responses = await Promise.allSettled(
                Object.entries(API_CONFIG).map(([apiType, config]) =>
                    fetchFromApi(config.url(filters.keyword === 'all' ? 'news' : filters.keyword), config.headers)
                        .then((data) => ({ apiType, data }))
                )
            );

            const normalizedArticles = responses
                .filter((res) => res.status === 'fulfilled' && res.value)
                .flatMap((res) => normalizeArticles(res.value.apiType, res.value.data));

            const uniqueCategories = [...new Set(normalizedArticles.map((article) => article.category))];
            const uniqueSources = [...new Set(normalizedArticles.map((article) => article.source))];
            const uniqueAuthors = [...new Set(normalizedArticles.map((article) => article.author))];

            setCategories(uniqueCategories);
            setSources(uniqueSources);
            setAuthors(uniqueAuthors);
            setArticles(normalizedArticles);
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError('Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    }, [filters.keyword]);

    const matchesFilters = (article) => {
        return (
            (!filters.keyword || filters.keyword === 'all' || article.title.includes(filters.keyword)) &&
            (!filters.category || article.category === filters.category) &&
            (!filters.source || article.source === filters.source) &&
            (!filters.author || article.author === filters.author) &&
            (!filters.startDate || new Date(article.date) >= new Date(filters.startDate)) &&
            (!filters.endDate || new Date(article.date) <= new Date(filters.endDate))
        );
    };

    const filteredArticles = useMemo(() => articles.filter(matchesFilters), [articles, filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    useEffect(() => {
        if (filters.keyword) {
            fetchArticles();
        }
    }, [filters.keyword, fetchArticles]);

    return (
        <ArticlesContext.Provider
            value={{
                filteredArticles,
                loading,
                error,
                handleFilterChange,
                categories,
                sources,
                authors,
            }}
        >
            {children}
        </ArticlesContext.Provider>
    );
};

ArticlesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ArticlesProvider;
