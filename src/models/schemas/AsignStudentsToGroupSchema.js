import { z } from "zod";

export const AsignStudentsToGroupSchema = z.object({
    order_type: z.string({ required_error: "seleccione una opcion" }),
});