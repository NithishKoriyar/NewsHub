export const articleMatcher = {
    containsAnyTerm: (text = "", terms = []) => {
      if (!text) return false;
      return terms.some(term => text.toLowerCase().includes(term.toLowerCase()));
    },
  
    getMatchDetails: (article, preferences) => {
      const { categories = [], sources = [], authors = [] } = preferences;
  
      const matchedCategories = categories.filter(category =>
        [article.title, article.description, article.category]
          .filter(Boolean)
          .some(text => text.toLowerCase().includes(category.toLowerCase()))
      );
  
      const matchesSource = article.source && articleMatcher.containsAnyTerm(article.source, sources);
      const matchesAuthor = article.author && articleMatcher.containsAnyTerm(article.author, authors);
  
      return {
        matchScore: (matchedCategories.length > 0 ? 1 : 0) + (matchesSource ? 1 : 0) + (matchesAuthor ? 1 : 0),
        matchDetails: {
          categories: matchedCategories,
          hasSourceMatch: matchesSource,
          hasAuthorMatch: matchesAuthor
        }
      };
    }
  };
  