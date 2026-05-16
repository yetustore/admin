import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  onPageChange: (page: number) => void;
};

const getVisiblePages = (page: number, totalPages: number) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  if (page <= 3) return [1, 2, 3, 4];
  if (page >= totalPages - 2) return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

  return [page - 1, page, page + 1];
};

const PaginationControls = ({
  page,
  totalPages,
  totalItems,
  startItem,
  endItem,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalItems === 0) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Mostrando {startItem} - {endItem} de {totalItems}
      </p>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={page === 1 ? 'pointer-events-none opacity-40' : ''}
            />
          </PaginationItem>

          {!visiblePages.includes(1) && (
            <>
              <PaginationItem>
                <PaginationLink href="#" onClick={(event) => { event.preventDefault(); onPageChange(1); }}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {visiblePages.map((visiblePage) => (
            <PaginationItem key={visiblePage}>
              <PaginationLink
                href="#"
                isActive={visiblePage === page}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(visiblePage);
                }}
              >
                {visiblePage}
              </PaginationLink>
            </PaginationItem>
          ))}

          {!visiblePages.includes(totalPages) && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" onClick={(event) => { event.preventDefault(); onPageChange(totalPages); }}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
              className={page === totalPages ? 'pointer-events-none opacity-40' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
