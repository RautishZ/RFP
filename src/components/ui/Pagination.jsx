import React from 'react';

const Pagination = ({ currentPage = 1, totalPages = 1, totalItems = 0, itemsPerPage = 10, onPageChange }) => {
  const startIndex = ((currentPage - 1) * itemsPerPage) + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="row pt-3">
      <div className="col-sm-12 col-md-5">
        <div className="dataTables_info" id="datatable_info" role="status" aria-live="polite">
          Showing {startIndex} to {endIndex} of {totalItems} entries
        </div>
      </div>
      <div className="col-sm-12 col-md-7 dataTables_wrapper">
        <div className="dataTables_paginate paging_simple_numbers" id="datatable_paginate">
          <ul className="pagination flex-wrap">
            <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-link"
              >
                Previous
              </button>
            </li>
            
            {getPageNumbers().map((pageNum, index) => (
              <li 
                key={pageNum === '...' ? `ellipsis-${index}` : `page-${pageNum}`} 
                className={`paginate_button page-item ${pageNum === currentPage ? 'active' : ''} ${pageNum === '...' ? 'disabled' : ''}`}
              >
                <button
                  onClick={() => pageNum !== '...' ? handlePageClick(pageNum) : null}
                  className="page-link"
                  disabled={pageNum === '...'}
                >
                  {pageNum}
                </button>
              </li>
            ))}
            
            <li className={`paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-link"
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pagination;