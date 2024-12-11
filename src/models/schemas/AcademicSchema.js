/* eslint-disable no-unused-vars */
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0); 

export const AcademicSchema = z.object({
  year: z
    .string({ required_error: "El año es obligatorio" })
    .regex(/^[0-9]{4}$/, { message: "Debe ser un año válido" }),

  initial_date: z.string({ required_error: "La fecha de inicio es obligatoria" }).refine(
    (value) => !isNaN(new Date(value).getTime()), 
    { message: "La fecha de inicio debe ser válida" }
  ),

  end_date: z.string({ required_error: "La fecha de fin es obligatoria" }).refine(
    (value) => !isNaN(new Date(value).getTime()), 
    { message: "La fecha de fin debe ser válida" }
  )
})
.refine(
  (data) => new Date(data.initial_date) <= new Date(data.end_date),
  { message: "La fecha de inicio debe ser anterior o igual a la fecha de fin", path: ["end_date"] }
);




