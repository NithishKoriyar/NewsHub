
import PropTypes from 'prop-types';

function ArticleCard({ article }) {
  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
        {article.title}
      </h2>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {article.description}
      </p>
      <div className="flex items-center justify-between">
        <small className="text-sm text-gray-500">
          By: {article.author || 'Unknown'} | Category: {article.category || 'General'}
        </small>
        <a 
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Read more
        </a>
      </div>
    </div>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string,
    category: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArticleCard;