export default function ConfirmDialog({ message, type, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container confirm-dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body confirm-dialog-body">
          <div className={`confirm-dialog-icon ${type === 'alert' ? 'confirm-icon-info' : 'confirm-icon-warning'}`}>
            <i className={type === 'alert' ? 'fa-solid fa-circle-info' : 'fa-solid fa-triangle-exclamation'}></i>
          </div>
          <p className="confirm-dialog-message">{message}</p>
        </div>
        <div className="modal-actions-row confirm-dialog-actions">
          {type === 'confirm' && (
            <button type="button" className="modal-btn-cancel" onClick={onCancel}>
              Batal
            </button>
          )}
          <button type="button" className="modal-btn-submit" onClick={onConfirm}>
            {type === 'confirm' ? 'Ya, Lanjutkan' : 'Mengerti'}
          </button>
        </div>
      </div>
    </div>
  );
}
