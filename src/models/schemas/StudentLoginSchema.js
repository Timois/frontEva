import { z } from "zod";

export const StudentLoginSchema = z.object({
  ci: z.string({ required_error: "El CI es obligatorio" })
    .min(8, "El mínimo del CI es 8 caracteres.")
    .max(8, "El máximo del CI es 8 caracteres."),
  password: z.string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña tiene que ser mayor a 7 caracteres"),
});