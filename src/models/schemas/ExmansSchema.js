import { z } from "zod";

export const ExmansSchema = z.object({
    title: z.string({ required_error: "El titulo es obligatorio" }),
    description: z.string({ required_error: "La descripcion es obligatoria" }),
    passing_score: z.number({ required_error: "La puntuacion es obligatoria" })
       .min(1, "La puntuacion debe ser mayor o igual a 1"),
    date_of_realization: z
        .string()
        .transform((val) => new Date(val)),
    time: z.number({ required_error: "El tiempo es obligatorio" })
       .min(1, "El tiempo debe ser mayor o igual a 1"), 
    places: z.number({ required_error: "El numero de lugares es obligatorio" })
      .min(1, "El numero de plazas debe ser mayor o igual a 1"),
    academic_management_period_id: z.number({ required_error: "El periodo es obligatorio" })
})