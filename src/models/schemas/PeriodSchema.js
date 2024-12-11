import { z } from "zod";

export const PeriodSchema = z.object ({
    period: z.string({ required_error: "El periodo es obligatorio"}),
    level: z.enum(["1","2","3","4","5"], { errorMap: () => ({ message: "Selecciona una opcion. "})})
})