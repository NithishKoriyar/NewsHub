import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, normalizeArticles, extractUniqueValues } from '../utils/apiUtils';
import { API_ENDPOINTS } from '../utils/apiEndpoints';

const useArticles = (keyword) => {
  // used tanstack/react-query for fetching data caching
  const query = useQuery({
    queryKey: ['articles', keyword],
    queryFn: async () => {
      if (!keyword) return { normalizedArticles: [], uniqueCategories: [], uniqueSources: [], uniqueAuthors: [] };

      // Split the keyword by comma and join with 'OR' for the query
      const keywordQuery = keyword.split(',').join(' OR ');

      // Encode the keyword query to ensure it's safe for URLs
      const encodedKeyword = encodeURIComponent(keywordQuery);

      // Fetch data from multiple APIs using API_ENDPOINTS utility
      const responses = await Promise.allSettled([
        fetchFromApi(API_ENDPOINTS.NEWS_API(encodedKeyword)).then(data => ({
          apiType: 'newsApi',
          data,
        })),
        fetchFromApi(API_ENDPOINTS.NY_TIMES_API(encodedKeyword)).then(data => ({
          apiType: 'nyTimesApi',
          data,
        })),
        fetchFromApi(API_ENDPOINTS.GUARDIAN_API(encodedKeyword)).then(data => ({
          apiType: 'guardianApi',
          data,
        })),
        fetchFromApi(API_ENDPOINTS.NEWSDATA_API(encodedKeyword)).then(data => ({
          apiType: 'newsDataApi',
          data,
        })),
      ]);

      // Process the responses to normalize articles
      let normalizedArticles = responses
        .filter(res => res.status === 'fulfilled' && res.value?.data)
        .flatMap(res => normalizeArticles(res.value.apiType, res.value.data));

      // Filter out invalid dates and sort all articles together
      normalizedArticles = normalizedArticles
        .filter(article => {
          const date = new Date(article.date);
          return date instanceof Date && !isNaN(date) && article.date !== 'No Date';
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // Extract unique categories, sources, and authors
      const uniqueCategories = extractUniqueValues(normalizedArticles, 'category'); // Extract unique categories
      const uniqueSources = extractUniqueValues(normalizedArticles, 'source'); // Extract unique sources
      const uniqueAuthors = extractUniqueValues(normalizedArticles, 'author'); // Extract unique authors

      return { normalizedArticles, uniqueCategories, uniqueSources, uniqueAuthors };
    },
    enabled: !!keyword,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
  });

  return query;
};

export default useArticles;
