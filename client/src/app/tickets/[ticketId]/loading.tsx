export default function Loading() {
  return (
    <section className="flex justify-center pt-5">
      <div
        className="w-full 
          max-w-sm
          border 
          border-gray-200 
          rounded-lg 
          shadow 
          dark:bg-gray-800 
          dark:border-gray-700
        "
      >
        <div className="p-6">
          <div
            role="status"
            className="space-y-2.5 animate-pulse flex justify-center"
          >
            <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-600 w-1/2"></div>
            <span className="sr-only">Loading...</span>
          </div>
          <hr className="my-2" />

          <div
            role="status"
            className="space-y-2.5 animate-pulse flex justify-center py-6"
          >
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-1/2"></div>
            <span className="sr-only">Loading...</span>
          </div>

          <div
            role="status"
            className="space-y-2.5 animate-pulse flex justify-center"
          >
            <div className="h-10 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
