import { z } from "zod";

export const ExmansSchema = z.object({
    title: z.string({ required_error: "El titulo es obligatorio" }),
    description: z.string({ required_error: "La descripcion es obligatoria" }),
    total_score: z
        .number({ invalid_type_error: "Debe ser un número" })
        .min(0, "La nota mínima permitida es 0")
        .max(100, "La nota máxima permitida es 100"),
    passing_score: z
        .number({ invalid_type_error: "Debe ser un número" })
        .min(0, "La nota mínima permitida es 0")
        .max(100, "La nota mínima debe ser menor o igual a 100"),
    date_of_realization: z.date({ required_error: "La fecha de realizacion es obligatoria" }).refine(
        (value) => !isNaN(new Date(value).getTime()),
        { message: "La fecha de inicio debe ser válida" }
    ),
    type: z.enum(["evaluacion", "examen"], { errorMap: () => ({ message: "Seleccione una opcion. " }) }),
    academic_management_period_id: z.string({ required_error: "Seleccione una opcion" })
        .regex(/^[0-9]+$/, { message: "Debe ser un id válido" })
    })
    .refine(
        (data) => data.passing_score <= data.total_score,
        {
            message: "La nota mínima no puede ser mayor que la nota total",
            path: ["passing_score"]
        }
    )