import { z } from "zod";

export const AssignCareerSchema = z.object({
    career_id: z.string({ required_error: "seleccione una opcion" })
    .regex(/^[0-9]+$/, { message: "Debe ser un id válido" }),
    user_id: z.string({ required_error: "seleccione una opcion" })
    .regex(/^[0-9]+$/, { message: "Debe ser un id válido" }),
})