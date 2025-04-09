/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";
import { ContainerButton } from "../login/ContainerButton";
import { ContainerInput } from "../login/ContainerInput";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { InputFile } from "./components/InputFile";
import { ImportExcelQuestionsContext } from "../../context/ImportExcelQuestionsProvider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportQuestionsSchema } from "../../models/schemas/ImportQuestionsSchema";

export const FileUpload = ({ area_id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileInputAccept, setFileInputAccept] = useState(".xlsx,.xls,.csv,.zip");
  const { addImportQuestion } = useContext(ImportExcelQuestionsContext);
  
  const { control, handleSubmit, reset, formState: { errors }, setValue } = 
    useForm({ 
      resolver: zodResolver(ImportQuestionsSchema),
      defaultValues: {
        importOption: "",
        file: null
      }
    });

  // Actualizar el tipo de archivo aceptado según la opción seleccionada
  useEffect(() => {
    if (control._formValues.importOption === "withImages") {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    } else if (control._formValues.importOption === "withoutImages") {
      setFileInputAccept(".xlsx,.xls,.csv");
    } else {
      setFileInputAccept(".xlsx,.xls,.csv,.zip");
    }
  }, [control._formValues.importOption]);

  const handleFileChange = (file) => {
    if (file) {
      console.log("✅ Archivo seleccionado:", file);
      setSelectedFile(file);
      setValue("file", file); // Si estás usando React Hook Form
    } else {
      console.warn("⚠ No se seleccionó ningún archivo.");
    }
  };

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setIsUploading(false);
  };

  const onSubmit = async (data) => {
    if (!area_id) {
      customAlert("El ID de área es obligatorio.", "error");
      return;
    }
    
    if (!selectedFile) {
      customAlert("Por favor, selecciona un archivo.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("area_id", area_id);

    console.log("Subiendo archivo con los siguientes datos:", formData.get("file"));

    try {
      setIsUploading(true);
      const response = data.importOption === "withImages"
        ? await postApi("excel_import_image/savezip", formData)
        : await postApi("excel_import/save", formData);

      setIsUploading(false);
      addImportQuestion(response);
      customAlert("Excel importado correctamente", "success");
      closeFormModal("importExcel");
      resetForm();
    } catch (error) {
      setIsUploading(false);
      console.error("Error al importar el Excel:", error);
      customAlert("Error al importar el Excel", "error");
    }
  };

  const handleCancel = () => {
    resetForm();
    closeFormModal("importExcel");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Título */}
      <ContainerInput>
        <h3 className="h5 mb-3">Opciones de importación</h3>
      </ContainerInput>

      {/* Opciones de importación */}
      <ContainerInput>
        <div className="d-flex gap-3">
          {/* Radio para "Con imágenes" */}
          <div>
            <Controller
              name="importOption"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    type="radio"
                    id="withImages"
                    {...field}
                    value="withImages"
                    checked={field.value === "withImages"}
                  />
                  <label htmlFor="withImages" className="ms-2">Con imágenes (.zip)</label>
                </>
              )}
            />
          </div>

          {/* Radio para "Sin imágenes" */}
          <div>
            <Controller
              name="importOption"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    type="radio"
                    id="withoutImages"
                    {...field}
                    value="withoutImages"
                    checked={field.value === "withoutImages"}
                  />
                  <label htmlFor="withoutImages" className="ms-2">Sin imágenes (.xlsx, .xls, .csv)</label>
                </>
              )}
            />
          </div>
        </div>
        {errors.importOption && (
          <p className="text-danger">{errors.importOption.message}</p>
        )}
      </ContainerInput>

      {/* Selección de archivo */}
      <ContainerInput>
        <label htmlFor="fileInput">Selecciona un archivo</label>
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <InputFile onChange={handleFileChange} accept={fileInputAccept} />
          )}
        />
        {selectedFile && <p className="mt-2 text-muted">Archivo seleccionado: {selectedFile.name}</p>}
        {errors.file && (
          <p className="text-danger">{errors.file.message}</p>
        )}
      </ContainerInput>

      {/* Botones */}
      <ContainerButton>
        <Button
          type="submit"
          disabled={isUploading}
          className="btn btn-primary"
        >
          {isUploading ? "Procesando..." : "Importar Archivo"}
        </Button>
        <CancelButton onClick={handleCancel} className="btn btn-danger" />
      </ContainerButton>
    </form>
  );
};