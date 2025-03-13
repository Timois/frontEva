import { z } from "zod";

export const QuestionsSchema = z.object({
    question: z.string({ required_error: "La pregunta es obligatoria" }).min(10, "El mínimo de caracteres es 10"),
    question_type: z.string({ required_error: "Seleccione una opcion" }),
    type: z.string({ required_error: "Seleccione una opcion" }),
    description: z.string({ required_error: "La descripcion es obligatoria" }),
    image: z
    .instanceof(FileList)
    .refine(
      (files) => files.length === 0 || files[0].size <= 2 * 1024 * 1024,
      { message: "El archivo debe ser menor a 2MB" }
    )
    .refine(
      (files) =>
        files.length === 0 ||
        ["image/jpeg", "image/png", "image/webp", "image/svg"].includes(files[0].type),
      { message: "Solo se permiten archivos JPG, PNG, WEBP o SVG" }
    )
    .optional(),
    dificulty: z.string({ required_error: "Seleccione una opcion" }),
    
})