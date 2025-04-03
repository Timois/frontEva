/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { ContainerButton } from "../login/ContainerButton";
import { ContainerInput } from "../login/ContainerInput";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { InputFile } from "./components/InputFile";

export const FileUpload = ({ area_id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importOption, setImportOption] = useState(null);
  const [fileInputAccept, setFileInputAccept] = useState(".xlsx,.xls,.csv,.zip");

  useEffect(() => {
    if (importOption === "withImages") {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    } else if (importOption === "withoutImages") {
      setFileInputAccept(".xlsx,.xls,.csv");
    } else {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    }
  }, [importOption]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      console.log("✅ Archivo seleccionado:", file);
      setSelectedFile(file);
    } else {
      console.warn("⚠ No se seleccionó ningún archivo.");
    }
  };
  

  const resetForm = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setImportOption(null);
  };

  const handleUpload = async () => {
    if (!area_id) {
      customAlert("El ID de área es obligatorio.", "error");
      return;
    }
    if (!selectedFile) {
      console.log("Error: No hay archivo seleccionado.");
      customAlert("Por favor, selecciona un archivo.", "warning");
      return;
    }
    if (!importOption) {
      customAlert("Selecciona una opción: Con imágenes o Sin imágenes.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("area_id", area_id);

    console.log("Subiendo archivo con los siguientes datos:", formData.get("file"));

    try {
      setIsUploading(true);
      const response = importOption === "withImages"
        ? await postApi("excel_import_image/savezip", formData)
        : await postApi("excel_import/save", formData);

      setIsUploading(false);
      customAlert("Excel importado correctamente", "success");
      closeFormModal("importExcel");
      resetForm();
    } catch (error) {
      setIsUploading(false);
      console.error("Error al importar el Excel:", error);
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
          {/* Radio para "Con imágenes" */}
          <div>
            <input
              type="radio"
              id="withImages"
              name="importOption"
              value="withImages"
              checked={importOption === "withImages"}
              onChange={() => setImportOption("withImages")}
            />
            <label htmlFor="withImages" className="ms-2">Con imágenes (.zip)</label>
          </div>

          {/* Radio para "Sin imágenes" */}
          <div>
            <input
              type="radio"
              id="withoutImages"
              name="importOption"
              value="withoutImages"
              checked={importOption === "withoutImages"}
              onChange={() => setImportOption("withoutImages")}
            />
            <label htmlFor="withoutImages" className="ms-2">Sin imágenes (.xlsx, .xls, .csv)</label>
          </div>
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
          disabled={isUploading || !selectedFile || !importOption}
          className="btn btn-primary"
        >
          {isUploading ? "Procesando..." : "Importar Archivo"}
        </Button>
        <CancelButton onClick={resetForm} className="btn btn-danger" />
      </ContainerButton>
    </form>
  );
};