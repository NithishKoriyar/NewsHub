export const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';

    const date = new Date(dateString);

    if (isNaN(date)) return 'Invalid Date';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};