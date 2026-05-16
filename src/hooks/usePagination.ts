import { useEffect, useMemo, useState } from 'react';

export const usePagination = <T,>(items: T[], pageSize = 10) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const startItem = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, items.length);

  return {
    page,
    setPage,
    totalPages,
    currentItems,
    totalItems: items.length,
    startItem,
    endItem,
  };
};
