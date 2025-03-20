/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';

export const InputFile = ({
  onChange,
  uploadUrl, 
  onUploadSuccess = () => {}, 
  onUploadError = () => {},
  validation = () => true, 
  validationMessage = 'Archivo no válido.', 
}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    
    if (file) {
      onChange(file) // Enviamos el archivo seleccionado al formulario
    }
  }
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo antes de subirlo.')
      return
    }

    if (!validation(selectedFile)) {
      alert(validationMessage)
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setIsUploading(true);
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Archivo subido con éxito')
      onUploadSuccess(response.data)
    } catch (error) {
      console.error('Error al subir el archivo', error)
      alert('Hubo un error al subir el archivo.')
      onUploadError(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  )
}