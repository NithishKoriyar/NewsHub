import { useState } from 'react';
import { Menu, X, Search, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';
import Select from './Select';
import PropTypes from 'prop-types';

const Navbar = ({
  uniqueSources,
  isLoading,
  onSourceChange,
  onSearch,
  onDateChange,
  clearFilters,
  hasFilters
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSearch = (query) => {
    if (query.length < 2) {
      alert("Please enter atleast 2 characters")
      return

    }

    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    onDateChange?.(value);
  };

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSelectedSource(value);
    onSourceChange?.(value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSource('');
    setSelectedDate('');
    clearFilters(); // Call the parent-provided function to reset parent filters
  };

  const renderFilters = () => (
    <div className="flex items-center space-x-4">
      <Select
        options={uniqueSources || []}
        value={selectedSource}
        onChange={handleSourceChange}
        placeholder="Select Source"
      />
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="border p-2 rounded-md"
      />
    </div>
  );

  return (
    <nav className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-1">
            <img
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-auto h-8"
            />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? <p>Loading...</p> : renderFilters()}
          </div>

          <div className="flex items-center space-x-4">
            {/* Your Feed Button */}
            <Link
              to="/feed"
              className="text-gray-700 bg-gray-200 hover:bg-indigo-100 hover:text-indigo-500 font-medium transition-colors px-4 py-1.5 rounded-md ml-1 border-2 border-blue-400"
            >
              Your Feed
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchVisible((prev) => !prev)}
              className="text-gray-700 bg-gray-200 hover:bg-indigo-100 hover:text-indigo-500 font-medium transition-colors px-2 py-1.5 rounded-md ml-1 border-2 border-blue-400"
              aria-label="Toggle search"
            >
              {isSearchVisible ? <SearchX className="h-6 w-6" /> : <Search className="h-6 w-6" />}
            </button>

            {/* Clear Filters Button */}
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                title="Clear Filters"
              >
                Reset
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset border-2 border-blue-400 md:hidden"
              aria-expanded={isMenuOpen}
              aria-label="Main menu"
            >
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isSearchVisible && (
        <div className="px-4 pb-4">
          <SearchInput onSearch={handleSearch} />
        </div>
      )}

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoading ? <p>Loading...</p> : renderFilters()}
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  uniqueSources: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  onSourceChange: PropTypes.func,
  onSearch: PropTypes.func,
  onDateChange: PropTypes.func,
  clearFilters: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool.isRequired,
};

export default Navbar;
