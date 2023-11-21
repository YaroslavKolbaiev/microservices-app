import { ProgressContext } from '@/Context/ProgressContext';
import Link from 'next/link';
import { useContext } from 'react';

interface Props {
  title: string;
  price: string;
  index: number;
  id: string;
}

const Body = ({ title, price, index, id }: Props) => {
  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

  const { setProgress } = useContext(ProgressContext);
  return (
    <tr className={`${bgColor} border-b dark:bg-zinc-800`}>
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
        {title}
      </th>
      <td className="px-6 py-4">${price}</td>
      <td className="px-6 py-4">
        <Link
          onClick={() => setProgress(true)}
          href={`/tickets/${id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export default Body;
