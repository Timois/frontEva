import { z } from "zod";

export const StudentSchema = z.object({
    ci: z.string({ required_error: "El CI es obligatorio" }).min(7, "El minimo de caracteres es 5"),
    name: z.string({ required_error: "El nombre es obligatorio" }).min(5, "El minimo de caracteres es 5"),
    paternal_surname: z.string().optional().or(z.literal("")),
    maternal_surname: z.string().optional().or(z.literal("")),
    phone_number: z
        .string({ required_error: "El número de teléfono es obligatorio" })
        .min(7, "Debe tener al menos 7 dígitos")
        .max(15, "No debe exceder 15 dígitos")
        .regex(/^[0-9]+$/, "Solo se permiten números")
        .transform((val) => Number(val)),
    birthdate: z.string({ required_error: "La fecha de nacimiento es obligatoria" }).refine(
        (value) => !isNaN(new Date(value).getTime()),
        { message: "La fecha de fin debe ser válida" }
    ),
}).refine(
    (data) =>
        (data.paternal_surname && data.paternal_surname.trim()) ||
        (data.maternal_surname && data.maternal_surname.trim()),
    {
        message: "Debe ingresar al menos uno de los apellidos con un mínimo de 5 caracteres.",
        path: ["paternal_surname"], // o podrías usar `["_form"]` si quieres que sea un error general
    }
);