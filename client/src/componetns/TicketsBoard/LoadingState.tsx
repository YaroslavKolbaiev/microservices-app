const LoadingState = () => {
  const arr = ['1', '2', '3', '4', '5'];
  return (
    <tbody>
      {arr.map((item, i) => {
        const bgColor =
          i % 2 === 0
            ? 'bg-white dark:bg-gray-600'
            : 'bg-gray-50 dark:bg-gray-700';
        return (
          <tr key={item} className={`${bgColor} border-b`}>
            <th
              scope="row"
              className="px-6
                py-4 
                font-medium 
                text-gray-900 
                whitespace-nowrap 
                dark:text-white
              "
            >
              <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-800 w-24"></div>
                <span className="sr-only">Loading...</span>
              </div>
            </th>
            <td className="px-6 py-4">
              <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-800 w-16"></div>
                <span className="sr-only">Loading...</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-800 w-24"></div>

                <span className="sr-only">Loading...</span>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default LoadingState;

{
  /* <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>

    <span className="sr-only">Loading...</span>
</div> */
}
