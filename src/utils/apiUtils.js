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

// to normalize articles objects from different APIs to a common format
export const normalizeArticles = (apiType, data) => {
    const normalizers = {
        newsApi: (data) =>
            data?.articles?.filter((article) => article.source?.name !== '[Removed]')?.map((article) => ({
                               title: article.title || 'No Title',
                description: article.description || 'No Description',
                url: article.url || '#',
                source: article.source?.name || 'Unknown',
                author: article.author || 'Unknown',
                category: 'General',
                image: article.urlToImage || null,
                date: article.publishedAt ? new Date(article.publishedAt).toISOString() : 'No Date',
            })) || [],

        nyTimesApi: (data) =>
            data?.response?.docs?.map((doc) => ({
                title: doc.abstract || 'No Title',
                description: doc.snippet || 'No Description',
                url: doc.web_url || '#',
                source: doc.source || 'The New York Times',
                author: 'Unknown',
                category: 'General',
                image: doc.multimedia?.find((media) => media.subtype === 'xlarge')?.url
                    ? `https://www.nytimes.com/${doc.multimedia.find((media) => media.subtype === 'xlarge').url}`
                    : null,
                date: doc.pub_date ? new Date(doc.pub_date).toISOString() : 'No Date',
            })) || [],

        guardianApi: (data) =>
            data?.response?.results?.map((result) => ({
                title: result.webTitle || 'No Title',
                description: result.fields?.trailText || 'No Description',
                url: result.webUrl || '#',
                source: 'The Guardian',
                author: 'Unknown',
                category: result.sectionName || 'General',
                image: null,
                date: result.webPublicationDate ? new Date(result.webPublicationDate).toISOString() : 'No Date',
            })) || [],

        newsDataApi: (data) =>
            data?.results?.map((result) => ({
                title: result.title || 'No Title',
                description: result.description || 'No Description',
                url: result.link || '#',
                source: result.source_name || result.source_id || 'Unknown',
                author: result.creator?.join(', ') || 'Unknown',
                category: result.category?.join(', ') || 'General',
                image: result.image_url || null,
                date: result.pubDate ? new Date(result.pubDate).toISOString() : 'No Date',
            })) || [],
    };

    const normalize = normalizers[apiType];
    if (!normalize) {
        console.warn(`Unsupported API type: ${apiType}`);
        return [];
    }

    return normalize(data); // Remove the sort here since we'll sort all articles together
};


export const extractUniqueValues = (items, key) => {
    const uniqueValues = new Set(items.map((item) => item[key]));
    return Array.from(uniqueValues);
};
