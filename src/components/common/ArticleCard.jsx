import PropTypes from 'prop-types';
import { formatDate } from '../../helper/formatDate';
import noImageInUrl from '../../assets/No_Image_Available.jpg';

// Separate component for article metadata
const ArticleMetadata = ({ author, source, date }) => (
  <small className="text-sm text-gray-500">
    {[
      author && `By: ${author}`,
      source && `Source: ${source}`,
      date && formatDate(date)
    ].filter(Boolean).join(' | ')}
  </small>
);

// Separate component for article image
const ArticleImage = ({ imageUrl, title }) => {
  if (!imageUrl) return null;

  return (
    <div className="mb-4 rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        loading="lazy"
        alt={title || 'Article image'}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = noImageInUrl)}
      />
    </div>
  );
};

function ArticleCard({ article }) {
  const {
    title,
    description,
    author,
    source,
    date,
    url,
    image
  } = article;

  return (
    <div className="flex flex-col sm:flex-row h-full rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {image && (
        <div className="sm:w-1/3">
          <ArticleImage imageUrl={image} title={title} />
        </div>
      )}
      <div className={`flex flex-col justify-between ${image ? 'sm:w-2/3 sm:pl-6' : 'w-full'}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-4 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <ArticleMetadata
            author={author}
            source={source}
            date={date}
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Read more
        </a>
      </div>
    </div>
  );
}

// Prop types for the components
ArticleMetadata.propTypes = {
  author: PropTypes.string,
  source: PropTypes.string,
  date: PropTypes.string
};

ArticleImage.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired
};

ArticleCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string,
    source: PropTypes.string,
    date: PropTypes.string,
    url: PropTypes.string.isRequired,
    image: PropTypes.string
  }).isRequired,
};

export default ArticleCard;
