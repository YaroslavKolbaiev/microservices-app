'use client';

import { ProgressContext } from '@/Context/ProgressContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

interface Props {
  path: string;
  name: string;
  dropDownHandler?: () => void;
}

const NavLink = ({ path, name, dropDownHandler }: Props) => {
  const { setProgress } = useContext(ProgressContext);
  const pagePath = usePathname();

  const onLinkClick = () => {
    if (dropDownHandler) {
      dropDownHandler();
    }

    if (pagePath !== path) {
      setProgress(true);
    }
  };
  return (
    <Link
      onClick={onLinkClick}
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
