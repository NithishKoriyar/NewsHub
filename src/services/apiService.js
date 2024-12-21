// import axios from "axios";

// const API_CONFIG = {
//     newsApi: {
//       url: (keyword) => `https://newsapi.org/v2/everything?q=${keyword}&apiKey=68008431ecca4451a586717f5ca325c2`,
//       normalize: (response) => response.data.articles.map((article) => ({
//         title: article.title,
//         description: article.description,
//         date: article.publishedAt,
//         source: article.source.name,
//         author: article.author,
//         category: "General", // Assuming general if no category
//         url: article.url,
//         image: article.urlToImage,
//       })),
//     },
//     guardianApi: {
//       url: (keyword) => `https://content.guardianapis.com/search?q=${keyword}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`,
//       normalize: (response) => response.data.response.results.map((article) => ({
//         title: article.webTitle,
//         description: null, // Guardian API doesn't provide a description
//         date: article.webPublicationDate,
//         source: "The Guardian",
//         author: null, // Guardian API doesn't provide authors
//         category: null,
//         url: article.webUrl,
//         image: null, // Guardian API doesn't provide images
//       })),
//     },
//     worldNewsApi: {
//       url: (keyword) => `https://api.worldnewsapi.com/top-news?source-country=in&language=en&date=2024-09-29&q=${keyword}`,
//       headers: { "x-api-key": "0e514196a5254092b39346db9028116e" },
//       normalize: (response) => response.data.news.map((article) => ({
//         title: article.title,
//         description: article.text,
//         date: article.published_date,
//         source: article.source,
//         author: article.authors ? article.authors.join(", ") : null,
//         category: article.category || null,
//         url: article.url,
//         image: article.image_url,
//       })),
//     },
//   };
  
//   const fetchArticles = async (api, keyword) => {
//     const config = API_CONFIG[api];
//     try {
//       const response = await axios.get(config.url(keyword), {
//         headers: config.headers || {},
//       });
//       return config.normalize(response);
//     } catch (error) {
//       console.error(`Error fetching articles from ${api}:`, error);
//       return [];
//     }
//   };
  
//   export { fetchArticles };