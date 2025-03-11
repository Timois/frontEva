import { z } from "zod";

export const AreaSchema = z.object({
    name: z.string({ required_error: "El nombre es obligatorio" }).min(5, "El mínimo de caracteres es 5"),
    description: z.string({ required_error: "La descripcion es obligatoria" }).min(10, "El mínimo de caracteres es 10"),
});
   
