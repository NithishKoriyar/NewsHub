  // Helper function to normalize date to YYYY-MM-DD format
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    try {
      // Handle ISO format
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      // Handle space-separated format
      if (dateString.includes(' ')) {
        return dateString.split(' ')[0];
      }
      // Handle just date format
      return dateString;
    } catch (error) {
      console.warn('Date parsing error:', dateString);
      console.error(error);
      return null;
    }
  };

  export default normalizeDate;