import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const ArticlesContext = createContext();

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
        endDate: ''
    });

    // For dynamic categories, sources, and authors
    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const [authors, setAuthors] = useState([]);

    const newsApi = "68008431ecca4451a586717f5ca325c2";
    const guardianApi = "b09a7947-19e5-4b10-95ed-0db996acea2c";
    const worldNewsApi = "0e514196a5254092b39346db9028116e";

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const responses = await Promise.allSettled([
                axios.get(`https://newsapi.org/v2/everything?q=${filters.keyword === 'all' ? 'news' : filters.keyword}&apiKey=${newsApi}`),
                axios.get(`https://content.guardianapis.com/search?q=${filters.keyword === 'all' ? 'news' : filters.keyword}&api-key=${guardianApi}`),
                axios.get(`https://api.worldnewsapi.com/top-news?source-country=in&language=en&date=2024-09-29&q=${filters.keyword === 'all' ? 'news' : filters.keyword}`, {
                    headers: { 'x-api-key': worldNewsApi }
                })
            ]);

            const normalizedArticles = responses
                .filter(res => res.status === 'fulfilled')
                .flatMap(res => {
                    const data = res.value.data;
                    if (data.articles) {
                        return data.articles
                            .filter(article => article.source?.name && article.source.name !== '[Removed]') // Exclude invalid or unwanted sources
                            .map(article => ({
                                title: article.title || 'No Title',
                                description: article.description || 'No Description',
                                date: article.publishedAt || 'No Date',
                                url: article.url || '#',
                                source: article.source?.name || 'Unknown',
                                author: article.author || 'Unknown',
                                category: 'General'
                            }));
                    }

                    // Normalize Guardian API articles
                    if (data.response && data.response.results) {
                        return data.response.results.map(result => ({
                            title: result.webTitle || 'No Title',
                            description: result.fields?.trailText || 'No Description',
                            date: result.webPublicationDate || 'No Date',
                            url: result.webUrl || '#',
                            source: 'The Guardian',
                            author: 'Unknown', // Guardian API doesn't include author in the response
                            category: result.sectionName || 'General'
                        }));
                    }

                    // Normalize WorldNewsAPI articles
                    if (data.top_news) {
                        return data.top_news.flatMap(category =>
                            category.news.map(article => ({
                                title: article.title || 'No Title',
                                description: article.text || 'No Description',
                                date: article.publish_date || 'No Date',
                                url: article.url || '#',
                                source: article.source || 'Unknown',
                                author: article.author || 'Unknown',
                                category: category.language || 'General'
                            }))
                        );
                    }

                    return [];
                });

            // Extract unique categories, sources, and authors
            const uniqueCategories = [...new Set(normalizedArticles.map(article => article.category))];
            const uniqueSources = [...new Set(normalizedArticles.map(article => article.source))];
            const uniqueAuthors = [...new Set(normalizedArticles.map(article => article.author))];

            setCategories(uniqueCategories);
            setSources(uniqueSources);
            setAuthors(uniqueAuthors);

            setArticles(normalizedArticles);
        } catch (error) {
            setError('Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    }, [filters.keyword]);

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            return (
                (!filters.keyword || filters.keyword === 'all' || article.title.includes(filters.keyword)) &&
                (!filters.category || article.category === filters.category) &&
                (!filters.source || article.source === filters.source) &&
                (!filters.author || article.author === filters.author) &&
                (!filters.startDate || new Date(article.date) >= new Date(filters.startDate)) &&
                (!filters.endDate || new Date(article.date) <= new Date(filters.endDate))
            );
        });
    }, [articles, filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    useEffect(() => {
        if (filters.keyword) {
            fetchArticles();
        }
    }, [filters.keyword, fetchArticles]);

    return (
        <ArticlesContext.Provider value={{ filteredArticles, loading, error, handleFilterChange, categories, sources, authors }}>
            {children}
        </ArticlesContext.Provider>
    );
};

ArticlesProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default ArticlesProvider;
