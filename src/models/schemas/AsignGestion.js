import { z } from "zod";

export const AsignGestionSchema = z.object({
    unit_id: z.string({ required_error: "seleccione una opcion" })
        .regex(/^[0-9]+$/, { message: "Debe ser un id válido" }),
    career_id:z.string({ required_error: "seleccione una opcion" })
    .regex(/^[0-9]+$/, { message: "Debe ser un id válido" }),
})