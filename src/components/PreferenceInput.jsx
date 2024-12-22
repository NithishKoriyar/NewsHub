import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

function PreferenceInput({ label, items, setItems, allItems }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addItem = (item) => {
    if (!items.includes(item)) {
      setItems([...items, item]);
      setInputValue("");
    }
  };

  const removeItem = (item) => {
    setItems(items.filter((i) => i !== item));
  };

  const filteredItems = allItems.filter((item) => {
    const itemName = item.name || item; // Handle both objects and strings
    return (
      !items.includes(item.id || itemName) &&
      itemName.toLowerCase().includes(inputValue.toLowerCase())
    );
  });

  return (
    <div className="space-y-2">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item) => {
          const selectedItem = allItems.find(
            (i) => i.id === item || i === item
          );
          const displayName = selectedItem?.name || selectedItem;

          return (
            <span
              key={item}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {displayName}
              <button
                type="button"
                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                onClick={() => removeItem(item)}
              >
                <span className="sr-only">Remove {displayName}</span>
                <X/>
              </button>
            </span>
          );
        })}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            id={label}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={`Search ${label}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="border border-gray-300 rounded-md overflow-y-auto max-h-[100px]">
          {filteredItems.map((item) => {
            const displayName = item.name || item;
            return (
              <button
                key={item.id || item}
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => addItem(item.id || item)}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Prop validation
PreferenceInput.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  setItems: PropTypes.func.isRequired,
  allItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
};

export default PreferenceInput;
