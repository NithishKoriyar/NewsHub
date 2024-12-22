import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, normalizeArticles, extractUniqueValues } from '../utils/apiUtils';



const useArticles = (keyword) => {
    const query = useQuery({
        queryKey: ['articles', keyword],
        queryFn: async () => {
            const responses = await Promise.allSettled([
                fetchFromApi(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=68008431ecca4451a586717f5ca325c2`).then(data => ({ apiType: 'newsApi', data })),
                fetchFromApi(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=3HSNMsAQVlAhFAQU1KUdAsq0imGs7u8b`).then(data => ({ apiType: 'nyTimesApi', data })),
                fetchFromApi(`https://content.guardianapis.com/search?q=${keyword}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`).then(data => ({ apiType: 'guardianApi', data })),
                fetchFromApi(`https://newsdata.io/api/1/latest?apikey=pub_62929980677fd39f31335878c0af88bdd56be&q=${keyword}&language=en`).then(data => ({ apiType: 'newsDataApi', data }))
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

            const uniqueCategories = extractUniqueValues(normalizedArticles, 'category'); // Extract unique categories if sort by category is implemented
            const uniqueSources = extractUniqueValues(normalizedArticles, 'source'); // Extract unique sources from articles if sort by source is implemented
            const uniqueAuthors = extractUniqueValues(normalizedArticles, 'author'); // Extract unique authors from articles if sort by author is implemented

            return { normalizedArticles, uniqueCategories, uniqueSources, uniqueAuthors };
        },
        enabled: !!keyword,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    return query;
};



export default useArticles;
