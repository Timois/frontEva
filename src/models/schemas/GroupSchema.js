import { z } from "zod";

export const GroupSchema = z.object({
    laboratory_id: z
        .string({ required_error: "El laboratorio es obligatorio" })
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().positive("El laboratorio debe ser un número positivo")),

    name: z
        .string({ required_error: "El nombre es obligatorio" })
        .max(20, "El nombre no puede tener más de 20 caracteres"),

    description: z
        .string()
        .max(255, "La descripción no puede tener más de 255 caracteres"),

    start_time: z
        .string({ required_error: "La hora de inicio es obligatoria" })
        .regex(/^\d{1,2}:\d{1,2}$/, "La hora de inicio debe tener el formato H:m (por ejemplo, 8:5 o 14:30)"),

    end_time: z
       .string({ required_error: "La hora de fin es obligatoria" })
       .regex(/^\d{1,2}:\d{1,2}$/, "La hora de fin debe tener el formato H:m (por ejemplo, 8:5 o 14:30)"),
    order_type: z.enum(["id_asc", "alphabetical"], {
        required_error: "Debe seleccionar un tipo de orden",
    }),
})
