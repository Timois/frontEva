/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { ContainerButton } from "../login/ContainerButton";
import { ContainerInput } from "../login/ContainerInput";

export const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [withImages, setWithImages] = useState(false);
  const [withoutImages, setWithoutImages] = useState(false);

  // Maneja la selección del archivo
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Maneja el cambio en el checkbox "Con imágenes"
  const handleWithImagesChange = (event) => {
    setWithImages(event.target.checked);
    if (event.target.checked) {
      setWithoutImages(false); // Desmarca la otra opción cuando ésta se marca
    }
  };

  // Maneja el cambio en el checkbox "Sin imágenes"
  const handleWithoutImagesChange = (event) => {
    setWithoutImages(event.target.checked);
    if (event.target.checked) {
      setWithImages(false); // Desmarca la otra opción cuando ésta se marca
    }
  };

  // Maneja la subida del archivo
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo Excel antes de subirlo.");
      return;
    }

    if (!withImages && !withoutImages) {
      alert("Por favor, selecciona una opción: Con imágenes o Sin imágenes.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("withImages", withImages);

    try {
      setIsUploading(true);
      const response = await axios.post("tu_url_de_api_aqui", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(response.data);
      alert("Archivo subido con éxito");
    } catch (error) {
      console.error("Error al subir el archivo", error);
      alert("Hubo un error al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setWithImages(false);
    setWithoutImages(false);
  };

  // Verifica si el archivo seleccionado es un Excel
  const isExcelFile = selectedFile && 
    (selectedFile.name.endsWith('.xlsx') || 
     selectedFile.name.endsWith('.xls') ||
     selectedFile.name.endsWith('.csv'));

  return (
    <form>
      {/* Título del formulario */}
      <h2>Importar archivo Excel</h2>
      
      {/* Contenedor para la selección de archivos */}
      <ContainerInput>
        <input 
          id="fileInput"
          type="file" 
          onChange={handleFileChange} 
          accept=".xlsx,.xls,.csv"
        />
        {selectedFile && (
          <p>Archivo seleccionado: {selectedFile.name}</p>
        )}
        {selectedFile && !isExcelFile && (
          <p style={{ color: 'red' }}>
            ¡Por favor selecciona un archivo Excel válido (.xlsx, .xls o .csv)!
          </p>
        )}
      </ContainerInput>

      {/* Contenedor para las opciones */}
      <div style={{ margin: '20px 0' }}>
        <h3>Opciones de importación:</h3>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Opción "Con imágenes" */}
          <div className="gap-2 m-2 p-2">
            <input
              type="checkbox"
              id="withImages"
              checked={withImages}
              onChange={handleWithImagesChange}
            />
            <label htmlFor="withImages"> Con imágenes</label>
          </div>
          
          {/* Opción "Sin imágenes" */}
          <div className="gap-2 m-2 p-2">
            <input
              type="checkbox"
              id="withoutImages"
              checked={withoutImages}
              onChange={handleWithoutImagesChange}
            />
            <label htmlFor="withoutImages"> Sin imágenes</label>
          </div>
        </div>
      </div>

      {/* Contenedor para los botones */}
      <ContainerButton>
        <Button 
          type="button" 
          onClick={handleUpload} 
          disabled={isUploading || !selectedFile || !isExcelFile || (!withImages && !withoutImages)}
        >
          {isUploading ? "Procesando..." : "Importar Excel"}
        </Button>
        <CancelButton onClick={resetForm} />
      </ContainerButton>

      {/* Mostrar respuesta del servidor si existe */}
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Respuesta del servidor:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </form>
  );
};