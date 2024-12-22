import { useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';
import useArticles from "../hooks/useArticles";
import CategorySelector from '../components/CategorySelector';
import useFilter from '../hooks/useFilter';
import SearchInput from '../components/SearchInput';

function HomePage() {
  const [keyword, setKeyword] = useState('everything'); // Default keyword
  const { data, error, isLoading } = useArticles(keyword);
  // Destructure the filtered data and filter functions from the custom hook
  const { filteredData, setSelectedCategories, setSelectedSource, setSelectedDate, clearFilters, selectedCategories, selectedSource, selectedDate } = useFilter(data?.normalizedArticles || []);

  const handleSearch = (searchQuery) => {
    if (!searchQuery) return;
    setKeyword(searchQuery)
  };
  const handleDateFilter = (date) => setSelectedDate(date);

  const hasFilters = !!(selectedCategories.length || selectedSource || selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        uniqueSources={data?.uniqueSources || []}
        isLoading={isLoading}
        onSourceChange={setSelectedSource}
        onSearch={handleSearch}
        onDateChange={handleDateFilter}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
      />
      <SearchInput onSearch={handleSearch} />
      <main className="mx-auto">
        <CategorySelector
          categories={data?.uniqueCategories || []}
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

          <div className="">
            {filteredData.map((article, index) => (
              <div key={article.id || `${article.title}-${index}`} className="overflow-hidden">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default HomePage;
