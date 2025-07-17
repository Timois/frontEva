import { z } from "zod";

export const GroupSchema = (isEdit = false) =>
  z.object({
    name: z
      .string({ required_error: "El nombre es obligatorio" })
      .max(20, "El nombre no puede tener más de 20 caracteres"),

    description: z
      .string()
      .max(255, "La descripción no puede tener más de 255 caracteres"),

    laboratory_id: z
      .number({
        required_error: "El laboratorio es obligatorio",
        invalid_type_error: "Valor inválido",
      })
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Seleccione un laboratorio válido",
      }),

    order_type: isEdit
      ? z.enum(["alphabetical", "id_asc"]).optional()
      : z.enum(["alphabetical", "id_asc"], {
          errorMap: () => ({ message: "Seleccione una opción." }),
        }),
  });
