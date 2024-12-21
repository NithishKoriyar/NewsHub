import { useState } from "react";
import PropTypes from "prop-types";
import { savePreferencesToLocalStorage } from "../utils/preferences";
import PreferenceInput from "./PreferenceInput";

const allSources = ["CNN", "BBC", "The New York Times", "Reuters", "Associated Press", "The Guardian", "The Washington Post", "Al Jazeera", "NPR", "Fox News"];
const allCategories = ["Politics", "Technology", "Science", "Entertainment", "Sports", "Business", "Health", "Education", "Environment", "Culture"];
const allAuthors = ["John Doe", "Jane Smith", "Alex Johnson", "Sam Brown", "Emily Davis", "Michael Wilson", "Sarah Thompson", "David Lee", "Lisa Chen", "Robert Taylor"];

export default function PreferencesForm({ initialPreferences }) {
  const [sources, setSources] = useState(initialPreferences.sources);
  const [categories, setCategories] = useState(initialPreferences.categories);
  const [authors, setAuthors] = useState(initialPreferences.authors);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (categories.length === 0) {
      alert("Please select at least one category.");
      return; // Prevent form submission
    }
    savePreferencesToLocalStorage({ sources, categories, authors });
    alert("Preferences saved!");
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Preferences Form</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Select your preferred sources, categories, and authors.</p>
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
                  />
                </div>
                <div className="flex-1">
                  <PreferenceInput
                    label="Authors"
                    items={authors}
                    setItems={setAuthors}
                    allItems={allAuthors}
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
    sources: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(PropTypes.string),
    authors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
