
import useCategoryAndSource from './../hooks/useCategoryAndSource';
import useFeedArticleFiltering  from "../hooks/useFeedArticleFiltering";
import ArticleCard from '../components/common/ArticleCard';
import { FeedHeader } from "../components/feed/FeedHeader";
import { WelcomeMessage } from "../components/feed/WelcomeMessage";
import Loader from "../components/common/Loader";
import PreferencesForm from "../components/feed/PreferenceForm";
import usePreferences from './../hooks/usePreferences';

export const PersonalizedFeed = () => {
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

  const sortedArticles = useFeedArticleFiltering(data?.normalizedArticles, preferences);

  if (!preferencesLoaded) return <Loader />;

  if (showPreferencesForm) {
    return (
      <PreferencesForm
        initialPreferences={preferences}
        onClose={handleClosePreferencesForm}
      />
    );
  }

  return (
    <div>
      <FeedHeader
        onUpdatePreferences={handleUpdatePreferences}
        preferencesExist={preferencesExist}
      />

      {!preferencesExist ? (
        <WelcomeMessage onUpdatePreferences={handleUpdatePreferences} />
      ) : (
        <>
          {isLoading && <Loader />}
          {isError && <p className="text-red-600">Error loading news...</p>}
          
          {!isLoading && !isError && data && (
            <div className="space-y-6">
              {sortedArticles.map((article) => (
                <div key={article.url}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PersonalizedFeed;