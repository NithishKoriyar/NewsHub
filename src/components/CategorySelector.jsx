import PropTypes from 'prop-types';

const CategorySelector = ({ categories, onSelectCategory, selectedCategories, isLoading }) => {
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      onSelectCategory(selectedCategories.filter(cat => cat !== category));
    } else {
      onSelectCategory([...selectedCategories, category]);
    }
  };

  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center bg-gray-100">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4">
      <div className="overflow-x-auto">
        <div className="grid grid-rows-2 auto-rows-max gap-2" 
             style={{ gridTemplateColumns: `repeat(${Math.ceil(categories.length / 2)}, max-content)` }}>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm m-1 font-medium whitespace-nowrap ${
                selectedCategories.includes(category)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

CategorySelector.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CategorySelector;