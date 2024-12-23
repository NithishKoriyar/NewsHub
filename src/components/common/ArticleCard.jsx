import PropTypes from 'prop-types';
import { formatDate } from '../../helper/formatDate';
import noImageInUrl from '../../assets/No_Image_Available.jpg';

const ArticleMetadata = ({ author, source, date }) => (
  <small className="text-sm text-gray-500">
    {[
      author && `By: ${author}`,
      source && `Source: ${source}`,
      date && formatDate(date)
    ].filter(Boolean).join(' | ')}
  </small>
);

const ArticleImage = ({ imageUrl, title }) => {
  if (!imageUrl) return null;
  return (
    <img
      src={imageUrl}
      loading="lazy"
      alt={title || 'Article image'}
      className="w-full h-72 sm:h-64 md:float-left md:w-96 md:mr-6 rounded-lg object-cover mb-4"
      onError={(e) => (e.target.src = noImageInUrl)}
    />
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
    <div className="relative overflow-hidden rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200  z-0">
      <div className="md:clearfix">
        <ArticleImage imageUrl={image} title={title} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          <div className="mt-4">
            <ArticleMetadata
              author={author}
              source={source}
              date={date}
            />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-600 hover:text-blue-800 font-medium text-center"
            >
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

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