import { PropTypes } from 'prop-types';
import GoBack from '../common/GoBack';

export const FeedHeader = ({ onUpdatePreferences, preferencesExist }) => {
  
  return (
    <div className="flex justify-between items-center mb-8 p-2 bg-white/70 backdrop-blur-md shadow-md px-4 sticky top-0 z-40">
      <span className="flex items-center">
      <GoBack/>
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Feeds</h1>
      </span>
      <button
        onClick={onUpdatePreferences}
        className="px-4 py-2 text-blue-600 bg-blue-200 hover:text-blue-800 rounded transition-colors"
      >
        {preferencesExist ? "Update Preferences" : "Set Preferences"}
      </button>
    </div>
  );
};
FeedHeader.propTypes = {
  onUpdatePreferences: PropTypes.func,   
    preferencesExist: PropTypes.bool,
};