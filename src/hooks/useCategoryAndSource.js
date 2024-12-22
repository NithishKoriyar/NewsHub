import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, normalizeArticles, extractUniqueValues } from '../utils/apiUtils';

const useCategoryAndSource = (categories, sources) => {
    const query = useQuery({
        queryKey: ['articlesByCategoryAndSource', categories, sources],
        queryFn: async () => {
            const categoryQuery = categories?.join(' OR ') || ''; // OR operator for multiple categories
            const sourceQuery = sources?.length > 0 ? `&sources=${sources.join(',')}` : ''; // Only include sources if provided

            const responses = await Promise.allSettled([
                // NewsAPI - Supports categories and sources
                fetchFromApi(
                    `https://newsapi.org/v2/everything?q=${categoryQuery}${sourceQuery}&apiKey=68008431ecca4451a586717f5ca325c2`
                ).then(data => ({ apiType: 'newsApi', data })),

                // NY Times API - Supports categories and a single source
                ...(sources?.[0]
                    ? sources.map(source =>
                        fetchFromApi(
                            `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categoryQuery}&fq=source:(${source})&api-key=3HSNMsAQVlAhFAQU1KUdAsq0imGs7u8b`
                        ).then(data => ({ apiType: 'nyTimesApi', data }))
                    )
                    : [
                        fetchFromApi(
                            `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categoryQuery}&api-key=3HSNMsAQVlAhFAQU1KUdAsq0imGs7u8b`
                        ).then(data => ({ apiType: 'nyTimesApi', data })),
                    ]),


                // NewsData.io API - Supports categories and domains (if applicable)
                fetchFromApi(
                    `https://newsdata.io/api/1/latest?q=${categoryQuery}&language=en&apikey=pub_62929980677fd39f31335878c0af88bdd56be`
                ).then(data => ({ apiType: 'newsDataApi', data })),

                // Guardian API - Supports only categories
                fetchFromApi(
                    `https://content.guardianapis.com/search?q=${categoryQuery}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`
                ).then(data => ({ apiType: 'guardianApi', data })),


            ]);

            // Get normalized articles from each successful response
            let normalizedArticles = responses
                .filter((res) => res.status === 'fulfilled' && res.value.data)
                .flatMap((res) => normalizeArticles(res.value.apiType, res.value.data));

            // Filter out invalid dates and sort all articles together
            normalizedArticles = normalizedArticles
                .filter(article => {
                    const date = new Date(article.date);
                    return date instanceof Date && !isNaN(date) && article.date !== 'No Date';
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const uniqueCategories = extractUniqueValues(normalizedArticles, 'category');
            const uniqueSources = extractUniqueValues(normalizedArticles, 'source');
            const uniqueAuthors = extractUniqueValues(normalizedArticles, 'author');


            return { normalizedArticles, uniqueCategories, uniqueSources, uniqueAuthors };
        },
        enabled: Array.isArray(categories) && categories.length > 0,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    return { ...query, refetch: query.refetch };
};

export default useCategoryAndSource;


