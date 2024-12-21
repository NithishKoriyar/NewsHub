import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, normalizeArticles, extractUniqueValues } from '../utils/apiUtils';

const useCategorySearch = (categories) => {
    const query = useQuery({
        queryKey: ['articlesByCategory', categories],
        queryFn: async () => {
            const categoryQuery = categories?.join(' OR ') || ''; // OR operator for multiple categories because of the some api wont accept ","

            const responses = await Promise.allSettled([
                fetchFromApi(`https://newsapi.org/v2/everything?q=${categoryQuery}&apiKey=68008431ecca4451a586717f5ca325c2`).then(data => ({ apiType: 'newsApi', data })),
                fetchFromApi(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categoryQuery}&api-key=3HSNMsAQVlAhFAQU1KUdAsq0imGs7u8b`).then(data => ({ apiType: 'nyTimesApi', data })),
                fetchFromApi(`https://content.guardianapis.com/search?q=${categoryQuery}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`).then(data => ({ apiType: 'guardianApi', data })),
                fetchFromApi(`https://newsdata.io/api/1/latest?apikey=pub_62929980677fd39f31335878c0af88bdd56be&q=${categoryQuery}&language=en`).then(data => ({ apiType: 'newsDataApi', data }))
            ]);

            const normalizedArticles = responses
                .filter((res) => res.status === 'fulfilled' && res.value.data)
                .flatMap((res) => normalizeArticles(res.value.apiType, res.value.data));

            const uniqueCategories = extractUniqueValues(normalizedArticles, 'category');
            const uniqueSources = extractUniqueValues(normalizedArticles, 'source');
            const uniqueAuthors = extractUniqueValues(normalizedArticles, 'author');
            console.log(uniqueCategories)
            console.log(uniqueSources)
            console.log(uniqueAuthors)

            return { normalizedArticles, uniqueCategories, uniqueSources, uniqueAuthors };
        },
        enabled: Array.isArray(categories) && categories.length > 0,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    return query;
};

export default useCategorySearch;
