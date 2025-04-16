/* eslint-disable no-unused-vars */
import { useState } from "react";

/* eslint-disable react/prop-types */
export const InputFile = ({
  value,
  onChange = () => {},
  uploadUrl,
  onUploadSuccess = () => {},
  onUploadError = () => {},
  validation = () => true,
  validationMessage = 'Archivo no válido.',
  error, // <- para mostrar errores opcionalmente
}) => {
  const [selectedFile, setSelectedFile] = useState(value || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) onChange([file]); // react-hook-form espera un array si definiste file_name como tipo FileList
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
};
