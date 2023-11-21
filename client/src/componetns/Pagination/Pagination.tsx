'use client';
import { useContext, useEffect } from 'react';
import { tailwindClasses } from '@/tailwind/reusableClasses';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ProgressContext } from '@/Context/ProgressContext';

type Props = {
  totalItems: number;
  jobsPerPage: number;
};

function Pagination({ totalItems, jobsPerPage }: Props) {
  const { setProgress } = useContext(ProgressContext);

  const searchParams = useSearchParams();

  const page = searchParams.get('page') || '1';

  const totalPages = Math.ceil(totalItems / jobsPerPage);

  const pageNumbers = getVisiblePages(+page, totalPages);

  const prevPage = (+page - (+page > 1 ? 1 : 0)).toString();
  const nextPage = (+page + (+page < totalPages ? 1 : 0)).toString();

  useEffect(() => {
    setProgress(false);
  }, [page]);

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-10">
      <ul className="flex">
        <PaginationLink
          pageName="Previous"
          pageValue={prevPage}
          disableCondition={+page === 1}
          onClick={setProgress}
        />
        {pageNumbers.map((pageNumber, i) => (
          <PaginationLink
            key={`${pageNumber}-${i}`}
            pageName={pageNumber.toString()}
            pageValue={pageNumber.toString()}
            disableCondition={pageNumber === +page}
            onClick={setProgress}
          />
        ))}
        <PaginationLink
          pageName="Next"
          pageValue={nextPage}
          disableCondition={+page === totalPages}
          onClick={setProgress}
        />
      </ul>
    </nav>
  );
}

enum PageType {
  PREVIOUS = 'Previous',
  NEXT = 'Next',
  DOTS = '...',
}

interface PaginationProps {
  pageName: string;
  pageValue: string;
  disableCondition?: boolean;
  onClick: (value: boolean) => void;
}

function PaginationLink({
  pageName,
  pageValue,
  disableCondition,
  onClick,
}: PaginationProps) {
  const pathName = usePathname();

  switch (pageName) {
    case PageType.NEXT:
      return (
        <Link
          onClick={() => !disableCondition && onClick(true)}
          className={`w-28
            py-2
            rounded-r-lg
            ${tailwindClasses.paginationLink}
            ${disableCondition && 'cursor-not-allowed'}
          `}
          href={{
            pathname: pathName,
            query: {
              page: pageValue,
            },
          }}
        >
          Next
        </Link>
      );
    case PageType.PREVIOUS:
      return (
        <Link
          onClick={() => !disableCondition && onClick(true)}
          className={`w-28
            py-2
            rounded-l-lg
            ${tailwindClasses.paginationLink}
            ${disableCondition && 'cursor-not-allowed'}
          `}
          href={{
            pathname: pathName,
            query: {
              page: pageValue,
            },
          }}
        >
          Previous
        </Link>
      );
    case PageType.DOTS:
      return (
        <span
          className={`px-4
            hidden
            md:block
            py-2
            ${tailwindClasses.paginationLink}
          `}
        >
          {pageValue}
        </span>
      );
    default:
      return (
        <Link
          onClick={() => !disableCondition && onClick(true)}
          className={`px-4
            hidden
            md:block
            py-2
            ${tailwindClasses.paginationLink}
          `}
          href={{
            pathname: pathName,
            query: {
              page: pageValue,
            },
          }}
        >
          {pageValue}
        </Link>
      );
  }
}

function getVisiblePages(current: number, total: number) {
  if (total <= 7) {
    return range(total);
  }
  if (current < 5) {
    return [...range(5), '...', total];
  }
  if (current > total - 4) {
    return [1, '...', ...range(5, total - 4)];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function range(count: number, start = 1) {
  return Array.from(new Array(count), (x, i) => i + start);
}

export default Pagination;
