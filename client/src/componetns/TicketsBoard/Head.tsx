const Head = () => {
  return (
    <thead
      className="text-xs
        text-gray-700 
        uppercase 
        bg-gray-50 
        dark:bg-gray-700 
        dark:text-gray-400
      "
    >
      <tr>
        <th scope="col" className="px-6 py-3">
          Event
        </th>
        <th scope="col" className="px-6 py-3">
          Price
        </th>
        <th scope="col" className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default Head;
