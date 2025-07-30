import React from "react";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderRadius: "15px" }}>
          <div
            className="modal-header"
            style={{
              borderBottom: "2px solid rgb(141, 141, 141)",
              paddingBlock: "10px",
            }}
          >
            <h2 className="modal-title text-dark">{title}</h2>
            <button type="button" className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
