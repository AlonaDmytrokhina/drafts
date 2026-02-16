
export function Pagination({ currentPage, totalPages, onPageChange, loading }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                className="button-orange"
                disabled={currentPage === 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Назад
            </button>

            <span className="page-info">
                Сторінка <strong>{currentPage}</strong> з {totalPages}
            </span>

            <button
                className="button-orange"
                disabled={currentPage === totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Вперед
            </button>
        </div>
    );
}