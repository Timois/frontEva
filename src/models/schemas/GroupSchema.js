import { z } from "zod";

export const GroupSchema = (isEdit = false) =>
  z.object({
    start_time: isEdit
      ? z.string().optional()
      : z
          .string({ required_error: "La hora de inicio es obligatoria" })
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: "Formato inválido. Usa HH:MM (ej: 08:00, 14:30)",
          }),

    laboratory_ids: z
      .array(
        z.coerce
          .number({ invalid_type_error: "ID de laboratorio inválido" })
          .int()
          .positive("ID inválido")
      )
      .min(1, "Debes seleccionar al menos un laboratorio")
      .max(50, "No puedes seleccionar más de 50 laboratorios"),
  });
