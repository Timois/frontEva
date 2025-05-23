import { z } from "zod";

export const ImportQuestionsSchema = z
  .object({
    importOption: z.enum(["withImages", "withoutImages"], {
      required_error: "Debe seleccionar una opción de importación",
    }),
    file_name: z.any()
      .refine((files) => Array.isArray(files) && files.length === 1, {
        message: "Debe seleccionar un archivo",
      })
      .refine((files) => {
        if (!files || !files[0]) return false;
        const file = files[0];
        return file.size <= 20 * 1024 * 1024;
      }, {
        message: "El archivo debe ser menor a 20MB",
      }),
    description: z.string().min(5, {
      message: "Debe ingresar una descripción",
    }),
    confirmImport: z.boolean().refine((val) => val === true, {
      message: "Debe confirmar que está seguro de importar las preguntas"
    })
  })
  .superRefine((data, ctx) => {
    if (!data.file_name || !data.file_name[0]) return;

    const file = data.file_name[0];
    const importOption = data.importOption;

    const isZip = file.type === "application/zip" || file.type === "application/x-zip-compressed" || file.name.toLowerCase().endsWith('.zip');
    const isExcelOrCsv = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ].includes(file.type) || file.name.toLowerCase().match(/\.(xlsx|xls|csv)$/);

    if (importOption === "withImages" && !isZip) {
      ctx.addIssue({
        path: ["file_name"],
        message: "Debe subir un archivo .zip para la opción con imágenes",
        code: z.ZodIssueCode.custom,
      });
    }

    if (importOption === "withoutImages" && !isExcelOrCsv) {
      ctx.addIssue({
        path: ["file_name"],
        message: "Debe subir un archivo Excel o CSV para esta opción",
        code: z.ZodIssueCode.custom,
      });
    }
  });
