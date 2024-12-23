import PropTypes from 'prop-types';

const Select = ({ options, value, onChange, placeholder }) => {
  return (
    <select
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" // Add a fixed width to the select element
      value={value}
      onChange={(e) => onChange(e)}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option} className="truncate">{option}</option> // Add "truncate" class to limit text overflow
      ))}
    </select>
  );
};

// Prop types for validation
Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default Select;
