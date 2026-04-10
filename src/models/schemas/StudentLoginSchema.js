import { z } from "zod";

export const StudentLoginSchema = z.object({
  ci: z.string({ required_error: "El CI es obligatorio" })
    .min(4, "El mínimo del CI es 4 caracteres."),
  password: z.string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});