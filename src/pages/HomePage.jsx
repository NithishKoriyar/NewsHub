import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';
import useArticles from "../hooks/useArticles";
import CategorySelector from '../components/CategorySelector';
import normalizeDate from '../helper/normalizeDate';

function HomePage() {
  const [keyword, setKeyword] = useState('news');
  const { data, error, isLoading } = useArticles(keyword);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const { normalizedArticles = [], uniqueSources = [], uniqueCategories = [] } = data || {};

  const filteredData = useMemo(() => {
    return normalizedArticles.filter(article => {
      const categoryMatch = !selectedCategories.length || selectedCategories.includes(article.category);
      const sourceMatch = !selectedSource || article.source === selectedSource;
      const dateMatch = !selectedDate || normalizeDate(article.date) === normalizeDate(selectedDate);
      return categoryMatch && sourceMatch && dateMatch;
    });
  }, [normalizedArticles, selectedCategories, selectedSource, selectedDate]);

  const handleSearch = (searchQuery) => setKeyword(searchQuery);
  const handleDateFilter = (date) => setSelectedDate(date);

  const clearFilters = () => {
    setSelectedSource('');
    setSelectedDate('');
    setSelectedCategories([]);
  };

  const hasFilters = selectedCategories.length || selectedSource || selectedDate;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        uniqueSources={uniqueSources}
        isLoading={isLoading}
        onSourceChange={setSelectedSource}
        onSearch={handleSearch}
        onDateChange={handleDateFilter}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
      />

      <main className="mx-auto">
        <CategorySelector
          categories={uniqueCategories}
          isLoading={isLoading}
          selectedCategories={selectedCategories}
          onSelectCategory={setSelectedCategories}
        />

        <div className="articles-container">
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          )}

          {error && (
            <div className="text-center py-10">
              <p className="text-red-600">{error}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => handleSearch(keyword)}
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && filteredData.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No articles available for your filters.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((article, index) => (
              <ArticleCard key={article.id || `${article.title}-${index}`} article={article} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
