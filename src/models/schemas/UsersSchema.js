import { z } from "zod";

export const UserSchema = z.object ({
    name: z.string({ required_error: "El nombre es obligatorio" }).max(20, "El maximo de  caracteres es 20").min(2, "El minimo de caracteres es 2"),
    email: z.string({ required_error: "El email es obligatorio" }).email("El email es invalido"),
    password: z.string({ required_error: "La contraseña es obligatoria" }).min(6, "La contraseña tiene que ser mayor a 5 caracteres"),
    password_confirmation: z.string({ required_error: "Repita la contraseña" }).min(6, "La contraseña tiene que ser mayor a 5 caracteres"),
    career_id: z.string().nullable().optional(),
    rol_id: z.string({ required_error: "Seleccione una opcion" }),
})