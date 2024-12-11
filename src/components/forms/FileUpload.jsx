/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';

export const FileUpload = () => {
 const [selectedFile, setSelectedFile] = useState(null);
 const [isUploading, setIsUploading] = useState(false);
 // Maneja la selección del archivo
 const handleFileChange = (event) => {
   setSelectedFile(event.target.files[0]);
 };
 // Maneja la subida del archivo
 const handleUpload = async () => {
   if (!selectedFile) {
     alert('Por favor, selecciona un archivo antes de subirlo.');
     return;
   }
   const formData = new FormData();
   formData.append('file', selectedFile);
   try {
     setIsUploading(true);
     const response = await axios.post('', formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     alert('Archivo subido con éxito');
   } catch (error) {
     console.error('Error al subir el archivo', error);
     alert('Hubo un error al subir el archivo.');
   } finally {
     setIsUploading(false);
   }
 };
 return (
   <div>
     <input type="file" onChange={handleFileChange} />
     <button onClick={handleUpload} disabled={isUploading}>
       {isUploading ? 'Subiendo...' : 'Subir Archivo'}
     </button>
   </div>
 );
};