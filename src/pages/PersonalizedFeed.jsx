import { useNavigate } from "react-router-dom";
import usePreferences from "../hooks/usePreferences";
import useCategoryAndSource from "../hooks/useCategoryAndSource";
import PreferencesForm from "../components/PreferenceForm";
import Loader from "../components/Loader";
import ArticleCard from "../components/ArticleCard";
import { ChevronLeft } from "lucide-react";

export default function PersonalizedFeed() {
  const navigate = useNavigate();
  const {
    preferences,
    preferencesLoaded,
    preferencesExist,
    showPreferencesForm,
    handleUpdatePreferences,
    handleClosePreferencesForm,
  } = usePreferences();

  const { data, isLoading, isError } = useCategoryAndSource(
    preferences.categories,
    preferences.sources
  );

  if (!preferencesLoaded) return <Loader />;

  const containsAnyTerm = (text = "", terms = []) => {
    if (!text) return false;
    return terms.some(term =>
      text.toLowerCase().includes(term.toLowerCase())
    );
  };

  const getArticleMatches = (article) => {
    const categories = Array.isArray(preferences.categories) ? preferences.categories : [];
    const sources = Array.isArray(preferences.sources) ? preferences.sources : [];
    const authors = Array.isArray(preferences.authors) ? preferences.authors : [];

    // Check category matches
    const matchedCategories = categories.filter(category =>
      article.title?.toLowerCase().includes(category.toLowerCase()) ||
      article.description?.toLowerCase().includes(category.toLowerCase()) ||
      article.category?.toLowerCase().includes(category.toLowerCase())
    );

    // Check source match
    const matchesSource = article.source && containsAnyTerm(article.source, sources);

    // Check author match
    const matchesAuthor = article.author && containsAnyTerm(article.author, authors);

    // Calculate total matches
    const matchScore = (matchedCategories.length > 0 ? 1 : 0) +
      (matchesSource ? 1 : 0) +
      (matchesAuthor ? 1 : 0);

    return {
      ...article,
      matchScore,
      matchDetails: {
        categories: matchedCategories,
        hasSourceMatch: matchesSource,
        hasAuthorMatch: matchesAuthor
      }
    };
  };

  const filterFeedArticles = (articles) => {
    // Process each article to get match information
    const processedArticles = articles.map(getArticleMatches);

    // Remove duplicates (based on URL) and keep the one with highest match score
    const uniqueArticles = Array.from(
      processedArticles.reduce((map, article) => {
        const existing = map.get(article.url);
        if (!existing || existing.matchScore < article.matchScore) {
          map.set(article.url, article);
        }
        return map;
      }, new Map()).values()
    );

    // Sort by match score (3 matches → 2 matches → 1 match → 0 matches)
    return uniqueArticles.sort((a, b) => b.matchScore - a.matchScore);
  };

  const sortedArticles = filterFeedArticles(data?.normalizedArticles || []);


  const renderArticles = (articles) => (
    <div className="space-y-6">
      {articles.map((article) => (
        <div key={article.url} >
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8 p-2 bg-white/70 backdrop-blur-md shadow-md px-4 sticky top-0 z-40">
      <span className="flex items-center">
        <ChevronLeft
          size={30}
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-blue-200 rounded-full"
        />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">
          Feeds
        </h1>
      </span>
      <button
        onClick={handleUpdatePreferences}
        className="px-4 py-2 text-blue-600 bg-blue-200 hover:text-blue-800 rounded transition-colors"
      >
        {preferencesExist ? "Update Preferences" : "Set Preferences"}
      </button>
    </div>
  );

  return (
    <div>
      {showPreferencesForm ? (
        <PreferencesForm
          initialPreferences={preferences}
          onClose={handleClosePreferencesForm}
        />
      ) : (
        <div>
          {renderHeader()}

          {!preferencesExist ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Welcome to Your Personalized Feed!
              </h2>
              <p className="text-gray-600 mb-6">
                Please set your preferences to start seeing personalized news articles.
              </p>
              <button
                onClick={handleUpdatePreferences}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set Your Preferences
              </button>
            </div>
          ) : (
            <>
              {isLoading && <Loader />}
              {isError && <p className="text-red-600">Error loading news...</p>}

              {!isLoading && !isError && data && renderArticles(sortedArticles)}
            </>
          )}
        </div>
      )}
    </div>
  );
}