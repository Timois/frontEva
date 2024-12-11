/* eslint-disable no-unused-vars */
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0); 

export const AcademicSchema = z.object({
  year: z
    .string({ required_error: "El año es obligatorio" })
    .regex(/^[0-9]{4}$/, { message: "Debe ser un año válido" }),

  initial_date: z.string({ required_error: "La fecha de inicio es obligatorio"}).date(),

  end_date: z.string({ required_error: " La fecha de fin es obligatorio"}).date()
    
    
})




