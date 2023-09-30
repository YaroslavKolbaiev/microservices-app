import { UseClickOutside } from '@/hooks/useClickOutside';
import NavLink from './NavLink';
import { useState } from 'react';
import { menuLinks } from '@/utils/menuLinks';
import Image from 'next/image';

const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropDownHandler = () => {
    setIsOpen(!isOpen);
  };

  const menuRef = UseClickOutside(() => {
    setIsOpen(false);
  });

  return (
    <div ref={menuRef} className="md:hidden relative">
      <button
        type="button"
        className="flex 
          items-center 
          p-2 
          w-10 
          h-10 
          justify-center 
          text-sm 
          text-gray-300 
          rounded-lg 
          hover:bg-gray-500 
          focus:outline-none 
          focus:ring-2 
          focus:ring-gray-200 
          dark:text-gray-400 
          dark:hover:bg-gray-700 
          dark:focus:ring-gray-600
        "
        aria-controls="navbar-dropdown"
        onClick={dropDownHandler}
      >
        <Image width={20} height={20} src="/menu.svg" alt="menu" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 z-10 min-w-[220px]"
          id="navbar-dropdown"
        >
          <ul
            className="flex 
              flex-col 
              gap-5 
              font-medium 
              p-4 border 
              border-gray-100 
              rounded-lg 
              bg-gray-600 
              dark:bg-gray-800 
              md:dark:bg-gray-900 
              dark:border-gray-700
            "
          >
            {menuLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  path={link.path}
                  name={link.name}
                  dropDownHandler={dropDownHandler}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;
