// Helper function to normalize date to YYYY-MM-DD format with timezone adjustment
const normalizeDate = (dateString) => {
  if (typeof dateString !== 'string' || !dateString.trim()) {
    return null;
  }

  try {
    const date = new Date(dateString);
    // Adjust the date for local timezone offset
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    // Return the normalized date in YYYY-MM-DD format
    return offsetDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date parsing error:', dateString, error);
    return null;
  }
};

export default normalizeDate;
