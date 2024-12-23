import { PropTypes } from 'prop-types';



export const WelcomeMessage = ({ onUpdatePreferences }) => (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Welcome to Your Personalized Feed!
      </h2>
      <p className="text-gray-600 mb-6">
        Please set your preferences to start seeing personalized news articles.
      </p>
      <button
        onClick={onUpdatePreferences}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Set Your Preferences
      </button>
    </div>
  );

WelcomeMessage.propTypes = {
  onUpdatePreferences: PropTypes.func
};