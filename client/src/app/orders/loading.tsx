export default function Loading() {
  return (
    <section className="max-w-md mx-auto mt-20">
      <div
        role="status"
        className="space-y-2.5 animate-pulse flex justify-center"
      >
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-28 mb-4"></div>
        <span className="sr-only">Loading...</span>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-5">
        {['1', '2', '3', '4', '5'].map((key) => (
          <li key={key} className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <div role="status" className="space-y-2.5 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-600 w-20 my-2"></div>
                  <span className="sr-only">Loading...</span>
                </div>
                <div role="status" className="space-y-2.5 animate-pulse">
                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-600 w-8"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <div
                role="status"
                className="space-y-2.5 animate-pulse flex justify-center"
              >
                <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-600 w-16"></div>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
