import "@/styles/components/ConfirmModal.css";

export const ConfirmModal = ({
                                 isOpen,
                                 title = "Підтвердження",
                                 message,
                                 onConfirm,
                                 onCancel
                             }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <h3>{title}</h3>
                <p>{message}</p>

                <div className="modal-buttons">
                    <button
                        className="btn-cancel"
                        onClick={onCancel}
                    >
                        Ні
                    </button>

                    <button
                        className="btn-confirm"
                        onClick={onConfirm}
                    >
                        Так
                    </button>
                </div>
            </div>
        </div>
    );
};