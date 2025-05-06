import { z } from "zod";

export const ExmansSchema = z.object({
    title: z.string({ required_error: "El titulo es obligatorio" }),
    description: z.string({ required_error: "La descripcion es obligatoria" }),
    total_score: z
        .string()
        .transform((val) => Number(val))
        .pipe(
            z.number()
            .min(0, "La nota mínima permitida es 0")
            .max(100, "La nota máxima permitida es 100")
        ),
    passing_score: z
        .string()
        .transform((val) => Number(val))
        .pipe(
            z.number()
            .min(0, "La nota mínima permitida es 0")
            .max(100, "La nota mínima debe ser menor o igual a 100")
        ),
    date_of_realization: z
        .string()
        .transform((val) => new Date(val)),
    type: z.enum(["ocr", "web", "app"], { 
        errorMap: () => ({ message: "Seleccione una opcion válida (ocr, web, app)" }) 
    }),
    qualified_students: z
       .string()
       .transform((val) => Number(val))
       .pipe(
            z.number()
           .min(0, "La cantidad mínima permitida es 0")
        ),
    disqualified_students: z
      .string()
      .transform((val) => Number(val))
      .pipe(
            z.number()
          .min(0, "La cantidad mínima permitida es 0")
        ),    
    academic_management_period_id: z.string({ required_error: "Seleccione una opcion" })
        .regex(/^[0-9]+$/, { message: "Debe ser un id válido" })
})