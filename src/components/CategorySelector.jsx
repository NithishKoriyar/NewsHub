import PropTypes from 'prop-types';

const CategoryButton = ({ category, isSelected, onClick }) => (
  <button
    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
      isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
    }`}
    onClick={() => onClick(category)}
  >
    {category}
  </button>
);

const CategorySelector = ({ categories, onSelectCategory, selectedCategories, isLoading }) => {
  const isAllSelected = selectedCategories.length === 0;

  const handleCategoryClick = (category) => {
    const updatedCategories =
      category === 'All'
        ? [] // Deselect all if "All" is clicked
        : selectedCategories.includes(category)
        ? selectedCategories.filter((cat) => cat !== category) // Remove category
        : [...selectedCategories, category]; // Add category

    onSelectCategory(updatedCategories);
  };

  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center bg-gray-100">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="flex overflow-x-auto no-wrap gap-2 py-3 justify-center">
        {/* Render "All" button */}
        <CategoryButton
          category="All"
          isSelected={isAllSelected}
          onClick={handleCategoryClick}
        />
        {/* Render other categories */}
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategories.includes(category)}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
    </div>
  );
};



CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

CategorySelector.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CategorySelector;
