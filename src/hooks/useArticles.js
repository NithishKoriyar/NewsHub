import { useQuery } from '@tanstack/react-query';
import { fetchFromApi, normalizeArticles, extractUniqueValues } from '../utils/apiUtils';



    const useArticles = (keyword) => {
        const query = useQuery({
            queryKey: ['articles', keyword],
            queryFn: async () => {
                const responses = await Promise.allSettled([
                    fetchFromApi(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=68008431ecca4451a586717f5ca325c2`).then(data => ({ apiType: 'newsApi', data })),
                    fetchFromApi(`https://content.guardianapis.com/search?q=${keyword}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`).then(data => ({ apiType: 'guardianApi', data })),
                    fetchFromApi(`https://api.currentsapi.services/v1/search?keywords=${keyword}&language=en&apiKey=MaIKvr8UXCNK-7CkFHt4BAD6PJ3x3JZA5O2T6ghapWeTcllF`).then(data => ({ apiType: 'currentsApi', data })),
                    fetchFromApi(`https://newsdata.io/api/1/latest?apikey=pub_62929980677fd39f31335878c0af88bdd56be&q=${keyword}&language=en`).then(data => ({ apiType: 'newsDataApi', data }))
                ]);
    
                const normalizedArticles = responses
                    .filter((res) => res.status === 'fulfilled' && res.value.data)
                    .flatMap((res) => normalizeArticles(res.value.apiType, res.value.data));
    
                const uniqueCategories = extractUniqueValues(normalizedArticles, 'category');
                const uniqueSources = extractUniqueValues(normalizedArticles, 'source');
                const uniqueAuthors = extractUniqueValues(normalizedArticles, 'author');
    
                return { normalizedArticles, uniqueCategories, uniqueSources, uniqueAuthors };
            },
            enabled: !!keyword,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        });
    
        return query;
    };
    


export default useArticles;
