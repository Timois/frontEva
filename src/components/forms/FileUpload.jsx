/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { ContainerButton } from "../login/ContainerButton";
import { ContainerInput } from "../login/ContainerInput";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";

// Agregamos area_id como prop al componente
export const FileUpload = ({ area_id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [response, setResponse] = useState(null);
  const [withImages, setWithImages] = useState(false);
  const [withoutImages, setWithoutImages] = useState(false);
  const [fileInputAccept, setFileInputAccept] = useState(".xlsx,.xls,.csv,.zip");

  // Actualiza los tipos de archivos aceptados según la opción seleccionada
  useEffect(() => {
    if (withImages) {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    } else if (withoutImages) {
      setFileInputAccept(".xlsx,.xls,.csv");
    } else {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    }

    // Si cambiamos de opción y el archivo actual no es válido, lo limpiamos
    if (selectedFile) {
      const isValidFile = checkFileValidity(selectedFile);
      if (!isValidFile) {
        setSelectedFile(null);
      }
    }
  }, [withImages, withoutImages, selectedFile]);

  // Función para verificar si el archivo es válido según la opción seleccionada
  const checkFileValidity = (file) => {
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
    const isZip = fileName.endsWith('.zip');

    if (withImages) {
      return isExcel || isZip;
    } else if (withoutImages) {
      return isExcel;
    }
    return true; // Si no hay opción seleccionada, no validamos
  };

  // Maneja la selección del archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
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

  // Resetea el formulario
  const resetForm = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setWithImages(false);
    setWithoutImages(false);
  };

  // Maneja la subida del archivo
  const handleUpload = async () => {
    // Verificamos que area_id exista
    if (!area_id) {
      customAlert("El ID de área es obligatorio.", "error");
      return;
    }

    if (!selectedFile) {
      customAlert("Por favor, selecciona un archivo antes de subirlo.", "warning");
      return;
    }

    if (!withImages && !withoutImages) {
      customAlert("Por favor, selecciona una opción: Con imágenes o Sin imágenes.", "warning");
      return;
    }

    if (!checkFileValidity(selectedFile)) {
      if (withImages) {
        customAlert("Con la opción 'Con imágenes' solo puedes subir archivos Excel (.xlsx, .xls, .csv) o ZIP (.zip)", "warning");
      } else {
        customAlert("Con la opción 'Sin imágenes' solo puedes subir archivos Excel (.xlsx, .xls, .csv)", "warning");
      }
      return;
    }

    // Prepara los datos para enviar
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("area_id", area_id); // Agregamos el area_id al FormData
    
    try {
      setIsUploading(true);
      
      let response;
      
      // Rutas diferentes según la opción seleccionada
      if (withImages) {
        // Para la opción con imágenes
        response = await postApi("excel_import_image/savezip", formData);
      } else {
        // Para la opción sin imágenes
        response = await postApi("excel_import/save", formData);
      }
      
      setIsUploading(false);
      
      if (response.status === 422) {
        for (const key in response.data.errors) {
          customAlert(response.data.errors[key][0], "error");
        }
        return;
      }
      
      customAlert("Excel importado correctamente", "success");
      closeFormModal("importExcel");
      resetForm();
      
    } catch (error) {
      console.error("Error al importar Excel:", error);
      setIsUploading(false);
      customAlert("Error al importar el Excel", "error");
    }
  };

  // Determina si el archivo es válido para la opción seleccionada
  const isFileValid = selectedFile ? checkFileValidity(selectedFile) : true;

  return (
      <form className="p-4 border rounded bg-light">
        {/* Opciones de importación */}
        <div className="mb-4">
          <h3 className="h5 mb-3">Opciones de importación:</h3>
  
          <div className="d-flex gap-3">
            {/* Opción "Con imágenes" */}
            <div className="form-check">
              <input
                type="checkbox"
                id="withImages"
                checked={withImages}
                onChange={handleWithImagesChange}
                className="form-check-input"
              />
              <label htmlFor="withImages" className="form-check-label">
                Con imágenes (.xlsx, .xls, .csv, .zip)
              </label>
            </div>
  
            {/* Opción "Sin imágenes" */}
            <div className="form-check">
              <input
                type="checkbox"
                id="withoutImages"
                checked={withoutImages}
                onChange={handleWithoutImagesChange}
                className="form-check-input"
              />
              <label htmlFor="withoutImages" className="form-check-label">
                Sin imágenes (.xlsx, .xls, .csv)
              </label>
            </div>
          </div>
        </div>
  
        {/* Contenedor para la selección de archivos */}
        <div className="mb-4">
          <label htmlFor="fileInput" className="form-label">
            Selecciona un archivo:
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            accept={fileInputAccept}
            className="form-control"
          />
  
          {selectedFile && (
            <p className="mt-2 text-muted">Archivo seleccionado: {selectedFile.name}</p>
          )}
  
          {selectedFile && !isFileValid && (
            <p className="mt-2 text-danger">
              {withImages
                ? "Con la opción 'Con imágenes' solo puedes subir archivos Excel (.xlsx, .xls, .csv) o ZIP (.zip)"
                : "Con la opción 'Sin imágenes' solo puedes subir archivos Excel (.xlsx, .xls, .csv)"}
            </p>
          )}
  
          {!withImages && !withoutImages && selectedFile && (
            <p className="mt-2 text-warning">
              Por favor, selecciona una opción antes de subir el archivo.
            </p>
          )}
        </div>
  
        {/* Contenedor para los botones */}
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !isFileValid || (!withImages && !withoutImages)}
            className="btn btn-primary"
          >
            {isUploading ? "Procesando..." : "Importar Archivo"}
          </Button>
          <CancelButton onClick={resetForm} className="btn btn-danger" />
        </div>
      </form>
  );
};