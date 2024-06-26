import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const RANGE = 2;

export default function PaginationCustom({
  pathname,
  queryConfig,
  totalPage,
  className,
}: {
  pathname: string;
  queryConfig: any;
  totalPage: number;
  className?: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(Number(queryConfig.page) || 0);
  let dotAfter = false;
  let dotBefore = false;

  useEffect(() => {
    setIsClient(true);
  }, []);

  function renderDotAfter(index: number) {
    if (!dotAfter) {
      dotAfter = true;
      return (
        <li
          key={`dot-after-${index}`}
          className="px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer"
        >
          ...
        </li>
      );
    }
  }

  function renderDotBefore(index: number) {
    if (!dotBefore) {
      dotBefore = true;
      return (
        <li
          key={`dot-before-${index}`}
          className="px-3 py-2 mx-2 bg-white border rounded shadow-sm cursor-pointer"
        >
          ...
        </li>
      );
    }
  }

  if (!isClient) {
    return null; // Avoid rendering on the server to prevent hydration issues
  }

  return (
    <Pagination className={`${className} ${totalPage ? "flex" : "hidden"}`}>
      <PaginationContent>
        <Link
          href={{
            pathname,
            query: {
              ...queryConfig,
              page: page - 1,
            },
          }}
          className={`block ${
            page === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"
          }`}
        >
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </Link>
        {Array(totalPage)
          .fill(0)
          .map((_, index) => {
            const pageNumber = index + 1;
            if (
              page <= RANGE * 2 + 1 &&
              pageNumber > page + RANGE &&
              pageNumber <= totalPage - RANGE
            ) {
              return renderDotAfter(index);
            } else if (page > RANGE * 2 + 1 && page < totalPage - RANGE * 2) {
              if (pageNumber < page - RANGE && pageNumber > RANGE) {
                return renderDotBefore(index);
              } else if (
                pageNumber > page + RANGE &&
                pageNumber < totalPage - RANGE + 1
              ) {
                return renderDotAfter(index);
              }
            } else if (
              page >= totalPage - RANGE * 2 &&
              pageNumber > RANGE &&
              pageNumber < page - RANGE
            ) {
              return renderDotBefore(index);
            }

            return (
              <Link
                href={{
                  pathname,
                  query: {
                    ...queryConfig,
                    page: pageNumber,
                  },
                }}
                onClick={() => setPage(pageNumber)}
                key={index}
              >
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={Number(pageNumber) == page}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </Link>
            );
          })}
        <Link
          href={{
            pathname,
            query: {
              ...queryConfig,
              page: page + 1,
            },
          }}
          className={`block ${
            page === totalPage
              ? "opacity-50 pointer-events-none"
              : "cursor-pointer"
          }`}
        >
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </Link>
      </PaginationContent>
    </Pagination>
  );
}
