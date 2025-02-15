import { z } from "zod";

export const ImportQuestionsSchema = z.object({
    file_name: z.instanceof(FileList).refine(
        (files) => files.length === 0 || files[0].size <= 20 * 1024 * 1024,
        { message: "El archivo debe ser menor a 20MB" }
      ).refine(
        (files) =>  
        files.length === 0 ||
        ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(files[0].type),
        { message: "Solo se permiten archivos excel XLSX, XLS" }
      ),
    status: z.enum(["error", "completado"]),
})