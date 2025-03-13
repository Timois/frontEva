/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { ContainerButton } from "../login/ContainerButton";
import { ContainerInput } from "../login/ContainerInput";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { InputFile } from "./components/InputFile";
import { CheckBox } from "./components/CheckBox";


export const FileUpload = ({ area_id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [withImages, setWithImages] = useState(false);
  const [withoutImages, setWithoutImages] = useState(false);
  const [fileInputAccept, setFileInputAccept] = useState(".xlsx,.xls,.csv,.zip");

  useEffect(() => {
    if (withImages) {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    } else if (withoutImages) {
      setFileInputAccept(".xlsx,.xls,.csv");
    } else {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    }
  }, [withImages, withoutImages]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setWithImages(false);
    setWithoutImages(false);
  };

  const handleUpload = async () => {
    if (!area_id) {
      customAlert("El ID de área es obligatorio.", "error");
      return;
    }
    if (!selectedFile) {
      customAlert("Por favor, selecciona un archivo.", "warning");
      return;
    }
    if (!withImages && !withoutImages) {
      customAlert("Selecciona una opción: Con imágenes o Sin imágenes.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("area_id", area_id);

    try {
      setIsUploading(true);
      const response = withImages
        ? await postApi("excel_import_image/savezip", formData)
        : await postApi("excel_import/save", formData);

      setIsUploading(false);
      customAlert("Excel importado correctamente", "success");
      closeFormModal("importExcel");
      resetForm();
    } catch (error) {
      setIsUploading(false);
      customAlert("Error al importar el Excel", "error");
    }
  };

  return (
    <form>
      {/* Título */}
      <ContainerInput>
        <h3 className="h5 mb-3">Opciones de importación</h3>
      </ContainerInput>

      {/* Opciones de importación */}
      <ContainerInput>
        <div className="d-flex gap-3">
          {/* CheckBox para "Con imágenes" */}
          <CheckBox
            label="Con imágenes (.zip)"
            checked={withImages}
            onChange={(isChecked) => {
              setWithImages(isChecked);
              if (isChecked) setWithoutImages(false);
            }}
          />

          {/* CheckBox para "Sin imágenes" */}
          <CheckBox
            label="Sin imágenes (.xlsx, .xls, .csv)"
            checked={withoutImages}
            onChange={(isChecked) => {
              setWithoutImages(isChecked);
              if (isChecked) setWithImages(false);
            }}
          />
        </div>
      </ContainerInput>

      {/* Selección de archivo */}
      <ContainerInput>
        <label htmlFor="fileInput">Selecciona un archivo</label>
        <InputFile onChange={handleFileChange} accept={fileInputAccept} />
        {selectedFile && <p className="mt-2 text-muted">Archivo seleccionado: {selectedFile.name}</p>}
      </ContainerInput>

      {/* Botones */}
      <ContainerButton>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || (!withImages && !withoutImages)}
          className="btn btn-primary"
        >
          {isUploading ? "Procesando..." : "Importar Archivo"}
        </Button>
        <CancelButton onClick={resetForm} className="btn btn-danger" />
      </ContainerButton>
    </form>
  );
};