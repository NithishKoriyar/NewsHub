import { useState, useEffect } from "react";
import PreferencesForm from "../components/PreferenceForm";
import { getPreferencesFromLocalStorage } from "../utils/preferences";
import Loader from "../components/Loader";
import useCategorySearch from "../hooks/useCategorySearch";
import ArticleCard from "../components/ArticleCard";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PersonalizedFeed() {
  const navigate = useNavigate();
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [preferencesExist, setPreferencesExist] = useState(false);
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);
  const [preferences, setPreferences] = useState({
    sources: [],
    categories: [],
    authors: [],
  });

  useEffect(() => {
    const { sources, categories, authors } = getPreferencesFromLocalStorage();
    setPreferences({
      sources: sources ? JSON.parse(sources) : [],
      categories: categories ? JSON.parse(categories) : [],
      authors: authors ? JSON.parse(authors) : [],
    });
    if (sources || categories || authors) {
      setPreferencesExist(true);
    }
    setPreferencesLoaded(true);
  }, [showPreferencesForm]);



  const handleUpdatePreferences = () => {
    setShowPreferencesForm(true);
    setPreferencesExist(false);
  };

  const handleClosePreferencesForm = () => {
    setShowPreferencesForm(false);
    setPreferencesExist(true); // Show feed again after closing form
  };

  const { data, isLoading, isError } = useCategorySearch(preferences.categories, preferences.sources);

  if (!preferencesLoaded) return <Loader />;

  const filterArticles = (articles) => {
    if (preferences.authors.length === 0) {
      return {
        matchedByAuthor: articles,
        unmatchedArticles: [],
      };
    }

    const matchedByAuthor = [];
    const unmatchedArticles = [];

    articles.forEach((article) => {
      if (preferences.authors.includes(article.author)) {
        matchedByAuthor.push(article);
      } else {
        unmatchedArticles.push(article);
      }
    });

    return {
      matchedByAuthor,
      unmatchedArticles,
    };
  };

  const { matchedByAuthor, unmatchedArticles } = filterArticles(data?.normalizedArticles || []);

  const renderArticlesSection = (heading, articles) => (
    <fieldset className="border border-gray-200 rounded-lg p-4 mb-6">
      <legend className="px-2 font-bold text-lg text-gray-700">{heading}</legend>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No articles found for this category.</p>
      )}
    </fieldset>
  );

  const hasNoMatches =
    !isLoading &&
    !isError &&
    preferences.authors.length > 0 &&
    matchedByAuthor.length === 0 &&
    unmatchedArticles.length === 0;

  return (
    <div>
      {showPreferencesForm ? (
        <PreferencesForm
          initialPreferences={preferences}
          onClose={handleClosePreferencesForm}
        />
      ) : (
        preferencesExist ? (
          <div>
            {/* Feed content */}
            <div className="flex justify-between items-center mb-8 p-2">
              <span className="flex items-center">
                <ChevronLeft
                  size={30}
                  onClick={() => navigate(-1)}
                  className="cursor-pointer bg-blue-200 rounded-full"
                />
                <h1 className="text-2xl font-bold text-gray-800 ml-3">Feeds</h1>
              </span>
              <button
                onClick={handleUpdatePreferences}
                className="px-4 py-2 text-blue-600 bg-blue-200 hover:text-blue-800 rounded transition-colors"
              >
                Update Pref
              </button>
            </div>
            {isLoading && <Loader />}
            {isError && <p className="text-red-600">Error loading news...</p>}
            {!isLoading && !isError && hasNoMatches && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p className="text-yellow-800">
                  No articles match your selected preferences. Try updating your preferences to see more articles.
                </p>
              </div>
            )}
            {data && !isLoading && (
              <div className="space-y-6">
                {renderArticlesSection(
                  preferences.authors.length === 0 ? "All Articles" : "Matched by Author",
                  matchedByAuthor
                )}
                {renderArticlesSection(
                  preferences.sources.length > 0 && preferences.categories.length > 0
                    ? "Articles"
                    : preferences.sources.length > 0
                      ? "Articles by Source"
                      : preferences.categories.length > 0
                        ? "Articles by Category"
                        : "Articles",
                  unmatchedArticles
                )}
              </div>
            )}
          </div>
        ) : (
          <PreferencesForm
            initialPreferences={preferences}
            onClose={handleClosePreferencesForm}
          />
        )
      )}
    </div>
  );

}
