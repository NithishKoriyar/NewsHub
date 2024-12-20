import { useContext } from 'react';
import { ArticlesContext } from '../context/ArticlesContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';

function HomePage() {
    const { filteredArticles, loading, error, handleFilterChange, categories, sources, authors } = useContext(ArticlesContext);

    const handleSearchChange = (e) => {
        handleFilterChange('keyword', e.target.value); // Update keyword filter
    };
    
    const handleCategoryChange = (e) => {
        handleFilterChange('category', e.target.value); // Update category filter
    };
    
    const handleSourceChange = (e) => {
        handleFilterChange('source', e.target.value); // Update source filter
    };

    const handleAuthorChange = (e) => {
        handleFilterChange('author', e.target.value); // Update author filter
    };

    const handleDateChange = (e) => {
        handleFilterChange('startDate', e.target.value); // Update start date filter
    };

    return (
        <>
            <Navbar />
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search by keyword"
                    onChange={handleSearchChange}
                />
                <select onChange={handleCategoryChange}>
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <select onChange={handleSourceChange}>
                    <option value="">All Sources</option>
                    {sources.map((source, index) => (
                        <option key={index} value={source}>{source}</option>
                    ))}
                </select>
                <select onChange={handleAuthorChange}>
                    <option value="">All Authors</option>
                    {authors.map((author, index) => (
                        <option key={index} value={author}>{author}</option>
                    ))}
                </select>
                <input type="date" onChange={handleDateChange} />
            </div>

            <div className="articles-container">
                {loading && <Loader />}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && filteredArticles.length === 0 && <p>No articles available.</p>}

                <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.map((article, index) => (
                        <ArticleCard key={index} article={article} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default HomePage;
