import { z } from "zod";

export const AcademicManagementPeriodSchema = z.object({
    initial_date: z.string({ required_error: "La fecha de inicio es obligatoria" }).refine(
        (value) => !isNaN(new Date(value).getTime()), 
        { message: "La fecha de inicio debe ser válida" }
      ),
      end_date: z.string({ required_error: "La fecha de fin es obligatoria" }).refine(
        (value) => !isNaN(new Date(value).getTime()), 
        { message: "La fecha de fin debe ser válida" }
      ),
      status: z.enum(["aperturado", "cerrado"], { errorMap: () => ({ message: "Seleccione una opcion. " }) }),
      academic_management_career_id: z.number({ required_error: "La carrera es obligatoria" }),
      period_id: z.number({ required_error: "el periodo es obligatoria" })
})
.refine(
    (data) => new Date(data.initial_date) <= new Date(data.end_date),
    { message: "La fecha de inicio debe ser anterior o igual a la fecha de fin", path: ["end_date"] }
  );