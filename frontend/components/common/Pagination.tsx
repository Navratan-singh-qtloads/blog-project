"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {

  if (totalPages <= 1) return null;

  return (

    <div className="flex justify-center items-center gap-2 mt-6">

      {/* PREVIOUS */}
      <button
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {Array.from(
        { length: totalPages },
        (_, index) => {

          const page = index + 1;

          return (

            <button
              key={page}
              onClick={() =>
                onPageChange(page)
              }
              className={`px-4 py-2 border rounded ${
                currentPage === page
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {page}
            </button>

          );
        }
      )}

      {/* NEXT */}
      <button
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === totalPages
        }
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}