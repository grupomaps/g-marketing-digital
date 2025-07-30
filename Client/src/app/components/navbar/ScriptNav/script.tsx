// Modal.tsx
import React from 'react';
import './script.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void; 
  children: React.ReactNode; 
}

const ScriptNav: React.FC<ModalProps> = ({ isOpen, onClose, onSave, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="content-modal">
        <p className="close-modal" onClick={onClose}>
          &times;
        </p>
        <div className="scripts">
        {children}
        </div>
      </div>
    </div>
  );
};

export default ScriptNav;
