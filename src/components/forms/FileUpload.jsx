/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { postApi } from "../../services/axiosServices/ApiService";
import { InputFile } from "./components/InputFile";
import { ImportExcelQuestionsContext } from "../../context/ImportExcelQuestionsProvider";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportQuestionsSchema } from "../../models/schemas/ImportQuestionsSchema";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";

export const FileUpload = () => {
  const { id } = useParams();
  const area_id = id;
  const { addImportExcel, importExcelQuestions } = useContext(ImportExcelQuestionsContext);
  const [response, setResponse] = useState(false);

  const { control, handleSubmit, reset, formState: { errors }, setError } =
    useForm({
      resolver: zodResolver(ImportQuestionsSchema),
    });

  const onSubmit = async (data) => {
    setResponse(true);
    const formData = new FormData();
    formData.append("file_name", data.file_name[0]);
    formData.append("area_id", area_id);
    formData.append("status", "completado");

    try {
      const response = await postApi("excel_import/save", formData);
      const success = response?.data?.success;
      // Si hay éxito, agregar las preguntas importadas al contexto
      addImportExcel(success ?? [], data.importOption);
      // Mostrar mensaje de éxito
      customAlert("📥 Importación finalizada. Revisa el resumen más abajo.", "success");
      // Cerrar modal y reiniciar formulario
      closeFormModal("importExcel");
      reset();
    } catch (error) {
      console.error("Error al importar preguntas:", error);
      customAlert("❌ Error al importar preguntas", "error");
      reset();
    } finally {
      setResponse(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <label htmlFor="importOption">Tipo de importación:</label>
        <Controller
          name="importOption"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <select {...field}>
              <option value="">Seleccione una opción</option>
              <option value="withoutImages">Sin imágenes (Excel)</option>
              <option value="withImages">Con imágenes (ZIP)</option>
            </select>
          )}
        />
        {errors.importOption && (
          <p style={{ color: "red" }}>{errors.importOption.message}</p>
        )}
      </ContainerInput>
      
      <ContainerInput>
        <Controller
          name="file_name"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputFile
              onChange={onChange}
              value={value}
              error={error}
            />
          )}
        />
      </ContainerInput>

      <ContainerButton>
        <Button type="submit" disabled={response}>
          {response ? "Importando..." : "Importar"}
        </Button>
        <CancelButton />
      </ContainerButton>

      {/* Mostrar resumen de importación */}
      {Array.isArray(importExcelQuestions) && importExcelQuestions.length > 0 && (
        <div style={{ marginTop: "1rem", background: "#f1f1f1", padding: "1rem", borderRadius: "8px" }}>
          <h4>📊 Resumen de importación</h4>
          <ul>
            {importExcelQuestions.map((item, index) => (
              <li key={index}>
                {typeof item === "string" ? (
                  <span>{item}</span>
                ) : (
                  <span>{item.message}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};
