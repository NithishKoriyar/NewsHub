import PropTypes from 'prop-types';

export function FilterSelect({ label, options, value, onChange }) {
    return (
        <div className="w-full sm:w-auto">
            <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                id={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                <option value="">All {label}s</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>

        </div>

    );
}

FilterSelect.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};