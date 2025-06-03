import { z } from "zod";

export const ImportStudentsSchema = z.object({
    file: z
        .instanceof(File, { message: "Debes subir un archivo" }) // Verifica que sea un archivo
        .refine((file) => file?.name?.match(/\.(xlsx|xls|csv)$/i), {
            message: "El archivo debe ser de tipo Excel (.xlsx, .xls, .csv)",
        }),
});
