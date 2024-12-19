
function Loader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="block text-sm text-gray-500 mt-4 text-center">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default Loader;