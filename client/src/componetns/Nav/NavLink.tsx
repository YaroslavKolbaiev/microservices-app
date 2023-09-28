'use client';

import { ProgressContext } from '@/Context/UserContext';
import Link from 'next/link';
import { useContext } from 'react';

interface Props {
  path: string;
  name: string;
  dropDownHandler?: () => void;
}

const NavLink = ({ path, name, dropDownHandler }: Props) => {
  const { setProgress } = useContext(ProgressContext);
  return (
    <Link
      onClick={() => {
        if (dropDownHandler) {
          dropDownHandler();
        }

        setProgress(true);
      }}
      href={path}
      className="text-white
        text-lg
        cursor-pointer
        hover:underline
        transition
        duration-200
      "
    >
      {name}
    </Link>
  );
};

export default NavLink;
