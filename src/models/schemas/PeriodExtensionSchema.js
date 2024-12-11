/* eslint-disable no-undef */
import { z } from "zod";

export const PeriodExtensionSchema = z.object ({
    initial_date: z
        .string({ required_error: "La fecha de inicio es obligatorio" })
        .refine((val) => new Date(val) >= today, 'La fecha inicio no puede ser antes de hoy'),
    end_date: z
        .string({ required_error: "La fecha fin es obligatorio"})
        .refine((val, ctx) => {
            const { initial_date } = ctx.parent;
            return new Date(val) > new Date(initial_date);
        }),
})