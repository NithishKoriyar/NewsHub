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

  // Fetch data based on user's preferences (category and source)
  const { data, isLoading, isError } = useCategoryAndSource(
    preferences.categories,
    preferences.sources
  );

  if (!preferencesLoaded) return <Loader />;

  // Function to filter articles based on category, source, and author preferences
  const filterFeedArticles = (articles) => {
    const matchedByCategoryAndSource = [];
    const matchedByAuthor = [];
    const unmatchedArticles = [];

    articles.forEach((article) => {
      const matchesCategory = preferences.categories.some((category) =>
        article.title.includes(category) || article.description.includes(category)
      );

      const matchesSource = preferences.sources.some((source) =>
        article.source.name.includes(source)
      );

      const matchesAuthor = preferences.authors.includes(article.author);

      // Match by category and source first
      if (matchesCategory && matchesSource) {
        matchedByCategoryAndSource.push(article);
      } 
      // Match by author if category and source are not enough
      else if (matchesAuthor) {
        matchedByAuthor.push(article);
      } else {
        unmatchedArticles.push(article);
      }
    });

    return { matchedByCategoryAndSource, matchedByAuthor, unmatchedArticles };
  };

  const {
    matchedByCategoryAndSource,
    matchedByAuthor,
    unmatchedArticles,
  } = filterFeedArticles(data?.normalizedArticles || []);

  const handlePreferencesClose = () => {
    handleClosePreferencesForm();
  };

  // Render articles section function
  const renderArticlesSection = (heading, articles) => (
    <fieldset className="border border-gray-200 rounded-lg p-4 mb-6">
      <legend className="px-2 font-bold text-lg text-gray-700">{heading}</legend>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-masonry">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No articles found for this section.</p>
      )}
    </fieldset>
  );

  return (
    <div>
      {showPreferencesForm ? (
        <PreferencesForm
          initialPreferences={preferences}
          onClose={handlePreferencesClose}
        />
      ) : preferencesExist ? (
        <div>
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
              Update Preferences
            </button>
          </div>

          {isLoading && <Loader />}
          {isError && <p className="text-red-600">Error loading news...</p>}

          {/* Display matched articles first */}
          {!isLoading && !isError && data && (
            <div className="space-y-6">
              {/* Articles that match category and source */}
              {matchedByCategoryAndSource.length > 0 &&
                renderArticlesSection("Matched by Category & Source", matchedByCategoryAndSource)}

              {/* Articles matched by author */}
              {matchedByAuthor.length > 0 && renderArticlesSection("Matched by Author", matchedByAuthor)}

              {/* Unmatched articles (those that didn't match category, source, or author) */}
              {unmatchedArticles.length > 0 && renderArticlesSection("All Articles", unmatchedArticles)}
            </div>
          )}
        </div>
      ) : (
        <PreferencesForm
          initialPreferences={preferences}
          onClose={handlePreferencesClose}
        />
      )}
    </div>
  );
}
