export const API_ENDPOINTS = {
    // NewsAPI supports both categories and sources
    NEWS_API: (categories, sources) => {
      const categoryQuery = categories ? `q=${categories}` : '';
      const sourceQuery = sources ? `&sources=${sources.join(',')}` : '';
      return `https://newsapi.org/v2/everything?${categoryQuery}${sourceQuery}&apiKey=68008431ecca4451a586717f5ca325c2`;//apikeys can be stored in .env
    },
  
    // NY Times API only supports categories and does not support sources
    NY_TIMES_API: (categories) =>
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categories}&api-key=3HSNMsAQVlAhFAQU1KUdAsq0imGs7u8b`,//apikeys can be stored in .env
  
    // NewsData.io API supports categories but no sources
    NEWSDATA_API: (categories) =>
      `https://newsdata.io/api/1/latest?q=${categories}&language=en&apikey=pub_62929980677fd39f31335878c0af88bdd56be`,//apikeys can be stored in .env
  
    // Guardian API supports only categories and no sources
    GUARDIAN_API: (categories) =>
      `https://content.guardianapis.com/search?q=${categories}&api-key=b09a7947-19e5-4b10-95ed-0db996acea2c`,//apikeys can be stored in .env
  };
  