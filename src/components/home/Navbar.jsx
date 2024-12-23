import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Select from '../common/Select';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Navbar = ({
  uniqueSources,
  isLoading,
  onSourceChange,
  onDateChange,
  clearFilters,
  hasFilters,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (date) => {
    if (!date) return;
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formattedDate = offsetDate.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    onDateChange?.(formattedDate);
  };


  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSelectedSource(value);
    onSourceChange?.(value);
  };

  const handleClearFilters = () => {
    setSelectedSource('');
    setSelectedDate('');
    clearFilters(); // Call the parent-provided function to reset parent filters
  };

  const renderFilters = () => (
    <div className="flex items-center justify-end space-x-4">
      <Select
        options={uniqueSources || []}
        value={selectedSource}
        onChange={handleSourceChange}
        placeholder="Select Source"
      />

      <DatePicker
        selected={selectedDate ? new Date(selectedDate) : null} // Parse formatted date back to a Date object
        onChange={handleDateChange} // Use the updated handler
        dateFormat="yyyy/MM/dd"
        placeholderText="Choose a date"
        className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        popperPlacement="bottom-start"
        popperClassName="custom-datepicker-popper"
        portalId="root-portal"
      />

    </div>
  );

  return (
    <nav className="bg-white/70 backdrop-blur-md">
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
            <Link
              to="/feed"
              className="text-gray-700  hover:text-indigo-500 font-medium transition-colors px-4 py-1.5 rounded-md ml-1 border-2 border-blue-400"
            >
              Your Feed
            </Link>

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
  onDateChange: PropTypes.func,
  clearFilters: PropTypes.func,
  hasFilters: PropTypes.bool,
};

export default Navbar;
