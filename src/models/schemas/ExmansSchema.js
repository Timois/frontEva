import { z } from "zod";
const today = new Date().toISOString().split('T')[0];
export const ExmansSchema = z.object({
    title: z.string({ required_error: "El titulo es obligatorio" }),
    description: z.string({ required_error: "La descripcion es obligatoria" }),
    passing_score: z.number({ required_error: "La puntuacion es obligatoria" })
       .min(1, "La puntuacion debe ser mayor o igual a 1"),
    date_of_realization: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
        .refine((val) => val >= today, {
            message: 'La fecha de realización no puede ser anterior a hoy',
        }),
    time: z.number({ required_error: "El tiempo es obligatorio" })
       .min(1, "El tiempo debe ser mayor o igual a 1"), 
    places: z.number({ required_error: "El numero de lugares es obligatorio" })
      .min(1, "El numero de plazas debe ser mayor o igual a 1"),
    academic_management_period_id: z.number({ required_error: "El periodo es obligatorio" })
})