// src/components/Pagination.jsx
export default function Pagination({ pagination, onPageChange }) {
  // if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages } = pagination;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className='flex items-center justify-center gap-2 mt-4'>
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-3 py-1  text-xs rounded disabled:opacity-50'>
        « Anterior
      </button>

      <span className='text-xs '>
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-3 py-1  text-xs rounded disabled:opacity-50'>
        Siguiente »
      </button>
    </div>
  );
}
