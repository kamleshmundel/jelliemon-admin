const Pagination = ({ total, page, perPage, setPage }: { total: number, page: number, perPage: number, setPage: (p: number) => void }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) range.push(i);
    if (page - delta > 2) range.unshift(-1);
    if (page + delta < pages - 1) range.push(-1);
    return [1, ...range, pages];
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      {getPageNumbers().map((p, i) =>
        p === -1 ? (
          <span key={i} className="px-2 text-zinc-500">...</span>
        ) : (
          <button
            key={i}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded-lg border border-zinc-700 transition-colors duration-150 ${
              page === p
                ? "bg-indigo-600 text-white shadow shadow-indigo-600/50"
                : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
