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
  const [duplicatesUrl, setDuplicatesUrl] = useState("");

  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm({
    resolver: zodResolver(ImportQuestionsSchema),
    defaultValues: {
      confirmImport: false
    }
  });

  const importOption = watch("importOption");

  const onSubmit = async (data) => {
    if (!data.confirmImport) {
      customAlert("❌ Debe confirmar que está seguro de importar las preguntas", "error");
      return;
    }

    setResponse(true);
    const formData = new FormData();
    formData.append("area_id", area_id);
    formData.append("status", "completado");
    formData.append("file_name", data.file_name[0]);

    try {
      let response;
      let repetidasObj = null;

      if (data.importOption === "withoutImages") {
        response = await postApi("excel_import/save", formData);
        const { success, message, resumen } = response?.data ?? {};

        if (success) {
          const mensajeResumen = `Total procesadas: ${resumen.total_procesadas}, Registradas: ${resumen.preguntas_registradas.total}`;
          addImportExcel([mensajeResumen], data.importOption);
          customAlert("📥 " + message, "success");
          closeFormModal("importExcel");
          reset();
        } else {
          customAlert("❌ Error en la importación", "error");
        }

      } else if (data.importOption === "withImages") {
        response = await postApi("excel_import_image/savezip", formData);
        const { success, message } = response?.data ?? {};
        
        if (success) {
          addImportExcel([message], data.importOption);
          customAlert("📥 " + message, "success");
          closeFormModal("importExcel");
          reset();
        } else {
          customAlert("❌ Error en la importación", "error");
        }
      }

    } catch (error) {
      console.error("Error al importar:", error);
      customAlert(`❌ Error al importar ${data.importOption === "withImages" ? "ZIP" : "Excel"}`, "error");
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
              onChange={(files) => onChange(files)}
              value={value}
              error={error}
              accept={importOption === "withImages" ? ".zip" : ".xlsx,.xls"}
              placeholder={importOption === "withImages" ? "Seleccione archivo ZIP" : "Seleccione archivo Excel"}
            />
          )}
        />
      </ContainerInput>

      {/* Checkbox de confirmación */}
      <ContainerInput>
        <div className="form-check mt-3">
          <Controller
            name="confirmImport"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <div className="d-flex align-items-start border p-3 rounded bg-light">
                <input
                  type="checkbox"
                  className="form-check-input me-2 mt-2"
                  id="confirmImport"
                  {...field}
                  checked={field.value}
                />
                <label className="form-check-label text-dark fw-bold" htmlFor="confirmImport" style={{ fontSize: '0.9rem' }}>
                  ⚠️ Confirmo que he revisado el archivo y su contenido es correcto.
                  Entiendo que una vez importadas las preguntas, no podrán ser editadas posteriormente.
                </label>
              </div>
            )}
          />
        </div>
        {errors.confirmImport && (
          <div className="text-danger mt-2">
            <small>⚠️ {errors.confirmImport.message}</small>
          </div>
        )}
      </ContainerInput>

      {/* Botones */}
      <ContainerButton>
        <Button type="submit" disabled={response}>
          {response ? "Importando..." : "Importar"}
        </Button>
        <CancelButton />
      </ContainerButton>

      {/* Resumen y descarga de duplicadas */}
      {Array.isArray(importExcelQuestions) && importExcelQuestions.length > 0 && (
        <div style={{ marginTop: "1rem", background: "#f1f1f1", padding: "1rem", borderRadius: "8px" }}>
          <h4>📊 Resumen de importación</h4>
          <ul>
            {importExcelQuestions.map((item, index) => (
              <li key={index}>
                {typeof item === "string" ? item : item.message}
              </li>
            ))}
          </ul>
          {duplicatesUrl && (
            <a
              href={duplicatesUrl}
              download
              className="btn btn-warning mt-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Descargar preguntas repetidas
            </a>
          )}
        </div>
      )}
    </form>
  );
};

