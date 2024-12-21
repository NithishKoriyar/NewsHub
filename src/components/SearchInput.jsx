import { useState } from 'react'
import { Search } from 'lucide-react'
import PropTypes from 'prop-types'

const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex justify-center">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className=" w-full sm:w-2/3 pl-3 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
      <Search/>
      </button>
    </form>
  )
}

export default SearchInput

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
};