import { z } from "zod";

export const GroupSchema = z.object({
    evaluation_id: z.number({ required_error: "La evaluación es obligatoria" }).int().positive(),
    name: z
        .string({ required_error: "El nombre es obligatorio" })
        .max(20, "El nombre no puede tener más de 20 caracteres"),
    description: z
        .string()
        .max(255, "La descripción no puede tener más de 255 caracteres"),
    start_time: z
        .string({ required_error: "La hora de inicio es obligatoria" })
        .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, "La hora de inicio debe tener el formato YYYY-MM-DD HH:mm"),
    end_time: z
        .string({ required_error: "La hora de finalización es obligatoria" })
        .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, "La hora de finalización debe tener el formato YYYY-MM-DD HH:mm"),
}).refine((data) => {
    const start = new Date(data.start_time.replace(" ", "T"));
    const end = new Date(data.end_time.replace(" ", "T"));
    return end > start;
}, {
    message: "La hora de finalización debe ser posterior a la hora de inicio",
    path: ["end_time"], // se muestra en el campo end_time
});
