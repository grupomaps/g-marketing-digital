import React, { useState } from "react";
import { storage } from "../../../firebase/firebaseConfig"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import "./modal.css";

interface ModalEditarFotoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newFotoUrl: string) => void; 
}

const ModalEditarFoto: React.FC<ModalEditarFotoProps> = ({ isOpen, onClose, onSave }) => {
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; 
      setSelectedFile(file);
      const newFotoUrl = URL.createObjectURL(file);
      setPreviewFoto(newFotoUrl);
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      const newFotoUrl = await uploadFoto(selectedFile); 
      onSave(newFotoUrl); 
    }
    onClose();
  };

  const uploadFoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `images/${file.name}`); 
    await uploadBytes(storageRef, file); 
    const url = await getDownloadURL(storageRef); 
    return url;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Foto</h2>
        {previewFoto ? (
          <img src={previewFoto} alt="Preview" className="preview-foto" />
        ) : (
          <p>Nenhuma foto selecionada</p>
        )}
        <div className="input-container">
          <label htmlFor="upload-foto" className="btn btn-upload">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 4v8H4v2h8v8h2v-8h8v-2h-8V4z" />
            </svg>
          </label>
          <input
            id="upload-foto"
            type="file"
            accept="image/*"
            onChange={handleFotoChange} 
            hidden
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarFoto;