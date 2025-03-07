import { z } from "zod";

export const CareerSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }).min(5, "El mínimo de caracteres es 5"),
  initials: z.string({ required_error: "La sigla es obligatoria" }).max(10, "El máximo de caracteres son 10"),
  logo: z
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
  type: z.string({ required_error: "Seleccione una opción" }),
  unit_id: z.union([
    z.string().regex(/^[0-9]+$/, { message: "Debe ser un ID válido" }),
    z.literal("")
  ]).optional()
}).superRefine((data, ctx) => {
  if (["carrera", "dependiente"].includes(data.type) && !data.unit_id) {
    ctx.addIssue({
      path: ["unit_id"],
      message: "Seleccione una opción",
      code: "custom"
    });
  }
});
