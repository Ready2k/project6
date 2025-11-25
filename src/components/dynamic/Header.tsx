import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b-2 border-purple-100 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">✨</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Dynamic Agent Desktop
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                DYNAMIC MODE
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Future State - AI-Orchestrated Interface
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          aria-label="Return to home page"
        >
          ← Back to Home
        </Link>
      </div>
    </header>
  );
}

export default Header;
