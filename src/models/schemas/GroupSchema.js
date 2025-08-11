import { z } from "zod";

export const GroupSchema = (isEdit = false) =>
  z.object({
    name: z
      .string({ required_error: "El nombre es obligatorio" })
      .max(20, "El nombre no puede tener más de 20 caracteres"),

    description: z
      .string()
      .max(255, "La descripción no puede tener más de 255 caracteres"),
      
    start_time: z
      .string({ required_error: "La hora de inicio es obligatoria" })
      .regex(/^\d{1,2}:\d{1,2}$/, "La hora de inicio debe tener el formato H:m (por ejemplo, 8:5 o 14:30)"),

    end_time: z
      .string({ required_error: "La hora de fin es obligatoria" })
      .regex(/^\d{1,2}:\d{1,2}$/, "La hora de fin debe tener el formato H:m (por ejemplo, 8:5 o 14:30)"),

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
