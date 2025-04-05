// models/schemas/UsersSchema.js
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" })
    .max(20, "El máximo de caracteres es 20")
    .min(2, "El mínimo de caracteres es 2"),
  email: z.string({ required_error: "El email es obligatorio" })
    .email("El email es inválido"),
  password: z.string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional(), // Opcional para edición
  career_id: z.union([
    z.string().transform(val => val === "" ? null : Number(val)),
    z.number().nullable()
  ]).optional(),
  role: z.array(
    z.union([
      z.string(),
      z.number().transform(val => String(val))
    ])
  ).nonempty("Seleccione al menos un rol")
});