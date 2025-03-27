import { z } from "zod";

export const PermissionsSchema = z.object({
    name: z.string({ required_error: "El nombre es obligatorio" }).max(20, "El maximo de  caracteres es 20"),
})