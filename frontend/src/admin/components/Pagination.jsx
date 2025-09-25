import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

export default function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages } = pagination;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className='flex justify-center mt-6'>
      <nav className='inline-flex items-center space-x-1'>
        {/* Doble flecha izquierda */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className={`flex items-center justify-center w-6 h-6 rounded border text-xs ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}>
          <FaAngleDoubleLeft />
        </button>

        {/* Flecha izquierda */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center justify-center w-6 h-6 rounded border text-xs ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}>
          <FaChevronLeft />
        </button>

        {/* Botones numerados */}
        {pages.map((page, idx) =>
          page === '...' ? (
            <span
              key={idx}
              className='flex items-center justify-center w-6.5 h-6.5 text-gray-500'>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-6.5 h-6.5 rounded border text-xs ${
                currentPage === page
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              }`}>
              {page}
            </button>
          )
        )}

        {/* Flecha derecha */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center justify-center w-6 h-6 rounded border text-xs ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}>
          <FaChevronRight />
        </button>

        {/* Doble flecha derecha */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`flex items-center justify-center w-6 h-6 rounded border text-xs ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}>
          <FaAngleDoubleRight />
        </button>
      </nav>
    </div>
  );
}
