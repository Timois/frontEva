// models/schemas/UsersSchema.js
import { z } from "zod";

// Lista de roles que no necesitan carrera
const ROLES_SIN_CARRERA = ["admin", "super-admin", "decano"];

export const UserSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" })
    .max(60, "El máximo de caracteres es 60")
    .min(2, "El mínimo de caracteres es 2"),
  email: z.string({ required_error: "El email es obligatorio" })
    .email("El email es inválido"),
  password: z
    .string()
    .optional()
    .refine(val => !val || val.length >= 6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
  career_id: z.union([
    z.string().regex(/^[0-9]+$/, { message: "Debe ser un id válido" }),
    z.null()
  ]).optional(),
  role: z.array(
    z.union([
      // Para strings directos
      z.string(),
      // Para números directos
      z.number().transform(val => String(val)),
      // Para objetos provenientes del SelectMultiple
      z.object({
        value: z.string(),
        label: z.string()
      }).transform(obj => obj.value)
    ])
  ).nonempty("Seleccione al menos un rol")
    .transform(roles => {
      // Extrae solo los valores si son objetos
      return roles.map(role =>
        typeof role === 'object' && role !== null && 'value' in role
          ? role.value
          : role
      );
    })
}).superRefine((data, ctx) => {
  // Verificar si alguno de los roles seleccionados está en la lista de roles sin carrera
  const tieneRolSinCarrera = data.role.some(rol =>
    ROLES_SIN_CARRERA.includes(rol)
  );

  // Si no tiene un rol sin carrera, entonces la carrera es obligatoria
  if (!tieneRolSinCarrera && (!data.career_id || data.career_id === null)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La carrera es obligatoria para este tipo de usuario",
      path: ["career_id"]
    });
  }
});