import { z } from "zod";

export const LabSchema = z.object({
    name: z.string({ required_error: "El nombre es obligatorio" }),
    location: z.string({ required_error: "La ubicacion es obligatoria" }),
    equipment_count: z.number({ required_error: "La cantidad de equipos es obligatoria" })
    .min(1, "La cantidad de equipos debe ser mayor o igual a 1"),
});