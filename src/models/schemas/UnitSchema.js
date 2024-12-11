import { z } from "zod";

export const UnitSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }).min(5, "El minimo de caracteres es 5"),
  initials: z.string({ required_error: "La sigla es obligatoria" }).max(10, "El maximo de caracteres son 10"),
  logo: z
    .instanceof(FileList, { message: "Debe seleccionar un archivo válido" }) 
    .refine((files) => files.length > 0, { message: "El logo es obligatorio" })
    .refine(
      (files) => files[0].size <= 2 * 1024 * 1024,
      { message: "El archivo debe ser menor a 2MB" }
    )
    .refine(
      (files) => ["image/jpeg", "image/png","image/webp","image/svg"].includes(files[0].type),
      { message: "Solo se permiten archivos JPG, PNG o WEBP y SVG" }
    ),
  type: z.enum(["unidad", "facultad"], { errorMap: () => ({ message: "Seleccione una opcion. " }) })
})