import { useMemo } from 'react';
import { articleMatcher } from '../utils/articleMatcher';

const useFeedArticleFiltering = (articles, preferences) => {
  return useMemo(() => {
    if (!articles?.length) return [];
    
    const processedArticles = articles.map(article => ({
      ...article,
      ...articleMatcher.getMatchDetails(article, preferences)
    }));

    const uniqueArticles = Array.from(
      processedArticles.reduce((map, article) => {
        const existing = map.get(article.url);
        if (!existing || existing.matchScore < article.matchScore) {
          map.set(article.url, article);
        }
        return map;
      }, new Map()).values()
    );

    return uniqueArticles.sort((a, b) => b.matchScore - a.matchScore);
  }, [articles, preferences]);
};
export default useFeedArticleFiltering