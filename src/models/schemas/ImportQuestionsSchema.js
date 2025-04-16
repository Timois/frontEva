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
        const file = files[0];
        return file.size <= 20 * 1024 * 1024;
      }, {
        message: "El archivo debe ser menor a 20MB",
      }),
  })
  .superRefine((data, ctx) => {
    const file = data.file_name?.[0];
    const importOption = data.importOption;

    if (!file) return;

    const isZip = file.type === "application/zip";
    const isExcelOrCsv = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ].includes(file.type);

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
