import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string({required_error: "Email es obligatorio"}).min(4, "EL minimo del usuario es 4 caracteres.").email("El email es invalido"),
    password: z.string({required_error: "La contraseña es obligatoria"}).min(5, "La contraseña tiene que ser mayor a 4 caracteres")
})