import { useState, useMemo } from 'react';
import normalizeDate from '../helper/normalizeDate';

const useFilter = (articles) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredData = useMemo(() => {
    return articles.filter(article => {
      const categoryMatch = !selectedCategories.length || selectedCategories.includes(article.category);
      const sourceMatch = !selectedSource || article.source === selectedSource;
      const dateMatch = !selectedDate || normalizeDate(article.date) === selectedDate;
      return categoryMatch && sourceMatch && dateMatch;
    });
  }, [articles, selectedCategories, selectedSource, selectedDate]);
  

  const clearFilters = () => {
    setSelectedSource('');
    setSelectedDate('');
    setSelectedCategories([]);
  };

  return {
    filteredData,
    setSelectedCategories,
    setSelectedSource,
    setSelectedDate,
    clearFilters,
    selectedCategories,
    selectedSource,
    selectedDate
  };
};

export default useFilter;
