//get user preferences from local storage
export const getPreferencesFromLocalStorage = () => {
    const sources = localStorage.getItem("sources");
    const categories = localStorage.getItem("categories");
    const authors = localStorage.getItem("authors");
  
    return { sources, categories, authors };
  };
  
  export const savePreferencesToLocalStorage = (preferences) => {
    const { sources, categories, authors } = preferences;
  
    if (sources) localStorage.setItem("sources", JSON.stringify(sources));
    if (categories) localStorage.setItem("categories", JSON.stringify(categories));
    if (authors) localStorage.setItem("authors", JSON.stringify(authors));
  };
  