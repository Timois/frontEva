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
import { useFetchQuestionsByArea } from "../../hooks/fetchQuestions";   // ← NUEVO
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";


export const FileUpload = () => {
  /* ---------- hooks & context ---------- */
  const { id } = useParams();
  const area_id = id;
  const { importExcelQuestions, getData } = useContext(ImportExcelQuestionsContext);

  // hook que permitirá volver a consultar las preguntas del área
  const { getDataQuestions } = useFetchQuestionsByArea();                    // ← NUEVO

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(ImportQuestionsSchema),
    defaultValues: { confirmImport: false }
  });

  const importOption = watch("importOption");

  /* ============== SUBMIT ============== */
  const onSubmit = async (data) => {
    if (!data.confirmImport) {
      customAlert("❌ Debe confirmar que está seguro de importar las preguntas", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("area_id", area_id);
    formData.append("status", "completado");
    formData.append("description", data.description);
    formData.append("file_name", data.file_name[0]);

    try {
      /* -------------- SIN IMÁGENES (Excel) -------------- */
      if (data.importOption === "withoutImages") {
        const { message, success } = await postApi("excel_import/save", formData);

        const resumenLinea = Array.isArray(success)
          ? success.find((txt) => txt.startsWith("Resumen:"))
          : null;

        if (resumenLinea) {
          customAlert(`📥 ${message}\n${resumenLinea}`, "success");                                   // ← REFETCH
          closeFormModal("importExcel");
          getData({ area_id });
          resetForm();
        } else {
          customAlert("❌ Error: no se encontró el resumen en la respuesta", "error");
          closeFormModal("importExcel");
          resetForm();
        }

        /* -------------- CON IMÁGENES (ZIP) -------------- */
      } else if (data.importOption === "withImages") {
        const { message, success, resumen } = await postApi(
          "excel_import_image/savezip",
          formData
        );

        if (success && resumen) {
          const {
            total_procesadas,
            preguntas_registradas,
            preguntas_no_registradas,
            preguntas_duplicadas
          } = resumen;

          const resumenLinea =
            `Resumen: Procesadas ${total_procesadas}, ` +
            `Registradas ${preguntas_registradas.total}, ` +
            `No registradas ${preguntas_no_registradas.total}, ` +
            `Duplicadas ${preguntas_duplicadas.total}`;

          customAlert(`📥 ${message}\n${resumenLinea}`, "success");                              // ← REFETCH
          closeFormModal("importExcel");
          getData({ area_id });
          resetForm();
        } else {
          customAlert("❌ Error en la importación", "error");
          closeFormModal("importExcel");
          resetForm();
        }
      }
    } catch (err) {
      console.error("Error al importar:", err);
      customAlert(`❌ Error al importar ${data.importOption === "withImages" ? "ZIP" : "Excel"}`, "error");
      closeFormModal("importExcel");
      resetForm();
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    reset({
      importOption: "",
      file_name: [],
      confirmImport: false
    });
  };
  /* ============== RENDER ============== */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ---------- Tipo de importación ---------- */}
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
        {errors.importOption && <p style={{ color: "red" }}>{errors.importOption.message}</p>}
      </ContainerInput>
      <ContainerInput>
        <Input type={"text"} placeholder="Descripción" name="description" control={control} />
        <Validate error={errors.description} />
      </ContainerInput>
      {/* ---------- Archivo ---------- */}
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

      {/* ---------- Confirmación ---------- */}
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
                <label
                  className="form-check-label text-dark fw-bold"
                  htmlFor="confirmImport"
                  style={{ fontSize: "0.9rem" }}
                >
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

      {/* ---------- Botones ---------- */}
      <ContainerButton>
        <Button type="submit" disabled={loading}>
          {loading ? "Importando..." : "Importar"}
        </Button>
        <CancelButton />
      </ContainerButton>
    </form>
  );
};
