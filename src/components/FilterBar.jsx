import { useState, useContext } from 'react';
import Select from './Select';
import { ArticlesContext } from '../context/ArticlesContext';

const FilterBar = () => {
  const { loading, handleFilterChange, sources, authors } = useContext(ArticlesContext);

  // Local state to manage filter values
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Handle changes in source filter
  const handleSourceChange = (e) => {
    console.log(e.target.value)
    setSelectedSource(e.target.value);
    handleFilterChange('source', e.target.value); // Update source filter in context
  };

  // Handle changes in author filter
  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
    handleFilterChange('author', e.target.value); // Update author filter in context
  };

  // Handle changes in date filter
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    handleFilterChange('date', e.target.value); // Update date filter in context
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or skeleton loader
  }

  return (
    <div>
      <Select
        options={sources}
        value={selectedSource}
        onChange={handleSourceChange}
        placeholder="All Sources"
      />
      {/* <Select
        options={authors}
        value={selectedAuthor}
        onChange={handleAuthorChange}
        placeholder="All Authors"
      /> */}
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default FilterBar;
