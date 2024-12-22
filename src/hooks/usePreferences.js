import { useState, useEffect } from "react";
import { getPreferencesFromLocalStorage } from "../utils/preferences";

export default function usePreferences() {
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [preferencesExist, setPreferencesExist] = useState(false);
  const [preferences, setPreferences] = useState({
    sources: [],
    categories: [],
    authors: [],
  });
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);

  useEffect(() => {
    const { sources, categories, authors } = getPreferencesFromLocalStorage();
    setPreferences({
      sources: sources ? JSON.parse(sources) : [],
      categories: categories ? JSON.parse(categories) : [],
      authors: authors ? JSON.parse(authors) : [],
    });
    setPreferencesExist(Boolean(sources || categories || authors));
    setPreferencesLoaded(true);
  }, [showPreferencesForm]);

  const handleUpdatePreferences = () => {
    setShowPreferencesForm(true);
    setPreferencesExist(false);
  };

  const handleClosePreferencesForm = () => {
    setShowPreferencesForm(false);
    setPreferencesExist(true);
  };

  return {
    preferences,
    preferencesLoaded,
    preferencesExist,
    showPreferencesForm,
    handleUpdatePreferences,
    handleClosePreferencesForm,
  };
}
