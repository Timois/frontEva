import { z } from "zod";

export const RolSchema = z.object ({
    name: z.string({ required_error: "El nombre es obligatorio" })
    .max(50, "El maximo de  caracteres es 50"),
})