import { useState } from "react";
import PropTypes from "prop-types";
import { savePreferencesToLocalStorage } from "../utils/preferences";
import PreferenceInput from "./PreferenceInput";
import { X } from "lucide-react";
import { allAuthors, allCategories, allSources } from "../constants/PreferencesConstants";

export default function PreferencesForm({ initialPreferences, onClose }) {
  const [sources, setSources] = useState(initialPreferences.sources);
  const [categories, setCategories] = useState(initialPreferences.categories);
  const [authors, setAuthors] = useState(initialPreferences.authors);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (categories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    // Save preferences to local storage.
    savePreferencesToLocalStorage({ sources, categories, authors });
    onClose();
    alert("Preferences saved!");

    // For debugging or backend submission:
    console.log({
      sources: sources.map((id) => allSources.find((src) => src.id === id)?.name),
      categories,
      authors,
    });
  };

  const hasPreference =
    initialPreferences.sources.length > 0 ||
    initialPreferences.categories.length > 0 ||
    initialPreferences.authors.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <span>
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Preferences Form
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Select your preferred sources, categories, and authors.
              </p>
            </span>
            {hasPreference && (
              <X
                className="mt-1 text-sm text-white font-bold bg-red-400 h-8 w-8 rounded-md"
                onClick={onClose}
              />
            )}
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <PreferenceInput
                    label="Sources"
                    items={sources}
                    setItems={setSources}
                    allItems={allSources}
                  />
                </div>
                <div className="flex-1">
                  <PreferenceInput
                    label="Categories"
                    items={categories}
                    setItems={setCategories}
                    allItems={allCategories}
                    placeholder="Search categories..."
                  />
                </div>
                <div className="flex-1">
                  <PreferenceInput
                    label="Authors"
                    items={authors}
                    setItems={setAuthors}
                    allItems={allAuthors}
                    placeholder="Search authors..."
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Prop validation
PreferencesForm.propTypes = {
  initialPreferences: PropTypes.shape({
    sources: PropTypes.arrayOf(PropTypes.string), // Array of source IDs
    categories: PropTypes.arrayOf(PropTypes.string),
    authors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
