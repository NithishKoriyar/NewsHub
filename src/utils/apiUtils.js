import axios from 'axios';


export const fetchFromApi = async (url, headers = {}) => {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};


export const normalizeArticles = (apiType, data) => {
    const normalizers = {
        newsApi: (data) =>
            data?.articles?.filter((article) => article.source?.name !== '[Removed]')?.map((article) => ({
                title: article.title || 'No Title',
                description: article.description || 'No Description',
                date: article.publishedAt || 'No Date',
                url: article.url || '#',
                source: article.source?.name || 'Unknown',
                author: article.author || 'Unknown',
                category: 'General',
                image: article.urlToImage || null,
            })) || [],

        guardianApi: (data) =>
            data?.response?.results?.map((result) => ({
                title: result.webTitle || 'No Title',
                description: result.fields?.trailText || 'No Description',
                date: result.webPublicationDate || 'No Date',
                url: result.webUrl || '#',
                source: 'The Guardian',
                author: 'Unknown',
                category: result.sectionName || 'General',
                image: null,
            })) || [],

        currentsApi: (data) =>
            data?.news?.map((article) => ({
                title: article.title || 'No Title',
                description: article.description || 'No Description',
                date: article.published || 'No Date',
                url: article.url || '#',
                source: 'Currents API',
                author: article.author || 'Unknown',
                category: article.category?.join(', ') || 'General',
                image: article.image || null,
            })) || [],

        newsDataApi: (data) =>
            data?.results?.map((result) => ({
                title: result.title || 'No Title',
                description: result.description || 'No Description',
                date: result.pubDate || 'No Date',
                url: result.link || '#',
                source: result.source_name || result.source_id || 'Unknown',
                author: result.creator?.join(', ') || 'Unknown',
                category: result.category?.join(', ') || 'General',
                image: result.image_url || null,
            })) || [],
    };

    const normalize = normalizers[apiType];
    if (!normalize) {
        console.warn(`Unsupported API type: ${apiType}`);
        return [];
    }

    const normalized = normalize(data);
    return normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
};


export const extractUniqueValues = (items, key) => {
    const uniqueValues = new Set(items.map((item) => item[key]));
    return Array.from(uniqueValues);
};
