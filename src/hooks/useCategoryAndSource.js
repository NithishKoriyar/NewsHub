import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, normalizeArticles, extractUniqueValues } from '../utils/apiUtils';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

const useCategoryAndSource = (categories, sources) => {
    const query = useQuery({
        queryKey: ['articlesByCategoryAndSource', categories, sources],
        queryFn: async () => {
            // Prepare the category query, only if categories are provided
            const categoryQuery = categories?.join(' OR ') || ''; // OR operator for multiple categories

            // Fetch data from APIs
            const responses = await Promise.allSettled([

                // NewsAPI supports both categories and sources
                fetchFromApi(API_ENDPOINTS.NEWS_API(categoryQuery, sources)).then(data => ({ apiType: 'newsApi', data })),

                // NY Times API only provides data from a single source, hence sources are not included
                fetchFromApi(API_ENDPOINTS.NY_TIMES_API(categoryQuery)).then(data => ({
                    apiType: 'nyTimesApi',
                    data,
                })),

                // NewsData.io API supports only categories, sources are not needed
                fetchFromApi(API_ENDPOINTS.NEWSDATA_API(categoryQuery)).then(data => ({
                    apiType: 'newsDataApi',
                    data,
                })),

                // Guardian API supports only categories
                fetchFromApi(API_ENDPOINTS.GUARDIAN_API(categoryQuery)).then(data => ({
                    apiType: 'guardianApi',
                    data,
                })),
            ]);

            // Process the responses to normalize articles
            let normalizedArticles = responses
                .filter(res => res.status === 'fulfilled' && res.value.data)
                .flatMap(res => normalizeArticles(res.value.apiType, res.value.data));

            // Filter out invalid dates and sort all articles together
            normalizedArticles = normalizedArticles
                .filter(article => {
                    const date = new Date(article.date);
                    return date instanceof Date && !isNaN(date) && article.date !== 'No Date';
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            // Extract unique categories, sources, and authors
            const uniqueCategories = extractUniqueValues(normalizedArticles, 'category');
            const uniqueSources = extractUniqueValues(normalizedArticles, 'source');
            const uniqueAuthors = extractUniqueValues(normalizedArticles, 'author');// Extract unique authors from all articles if needed

            return { normalizedArticles, uniqueCategories, uniqueSources, uniqueAuthors };
        },
        enabled: Array.isArray(categories) && categories.length > 0, // Ensure categories are provided
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    });

    return query;
};

export default useCategoryAndSource;
