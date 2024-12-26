export const articleMatcher = {
  // Function to check if a given text contains any term from a list of terms
  containsAnyTerm: (text = "", terms = []) => {
    if (!text) return false; 
    return terms.some(term => text.toLowerCase().includes(term.toLowerCase()));
  },
  
  // Function to calculate match details between an article and user preferences
  getMatchDetails: (article, preferences) => {
    // Destructure user preferences into separate variables with default empty arrays
    const { categories = [], sources = [], authors = [] } = preferences;

    // Find matching categories by filtering user categories that are present in the article's title, description, or category
    const matchedCategories = categories.filter(category =>
      [article.title, article.description, article.category] // Check title, description, and category
        .filter(Boolean) // Remove any null or undefined values
        .some(text => text.toLowerCase().includes(category.toLowerCase())) // Check if the category is in the text (case-insensitive)
    );

    // Check if the article's source matches any of the preferred sources
    const matchesSource = article.source && articleMatcher.containsAnyTerm(article.source, sources);

    // Check if the article's author matches any of the preferred authors
    const matchesAuthor = article.author && articleMatcher.containsAnyTerm(article.author, authors);

    // Calculate the match score based on the presence of matched categories, source, and author
    return {
      matchScore: 
        (matchedCategories.length > 0 ? 1 : 0) + // Add 1 if there are matched categories
        (matchesSource ? 1 : 0) + // Add 1 if there is a source match
        (matchesAuthor ? 1 : 0), // Add 1 if there is an author match
      
      // Return detailed match information
      matchDetails: {
        categories: matchedCategories, // List of matched categories
        hasSourceMatch: matchesSource, // Boolean indicating if the source matched
        hasAuthorMatch: matchesAuthor // Boolean indicating if the author matched
      }
    };
  }
};
