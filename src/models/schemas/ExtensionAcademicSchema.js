/* eslint-disable no-undef */
import { z } from "zod";

export const ExtensionAcademicSchema = z.object({
    date_extension: z
        .string({ required_error: "La fecha de extension es obligatorio" }),
    academic_management_id: z.string({required_error: "seleccione una opcion"})
    .regex(/^[0-9]$/, { message: "Debe ser un id válido" }),
})  