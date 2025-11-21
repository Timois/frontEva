import { z } from "zod";

// Esquema reutilizable: isEdit se mantiene por si en el futuro haces edición
export const GroupSchema = (isEdit = false) =>
  z.object({
    // Nombre base para todos los grupos (ej: "Examen Parcial Matemáticas")
    name: z
      .string({ required_error: "El nombre base de los grupos es obligatorio" })
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres")
      .trim(),

    // Descripción general (opcional) - se aplica a todos los grupos creados
    description: z
      .string()
      .max(500, "La descripción no puede exceder los 500 caracteres")
      .optional()
      .or(z.literal("").transform(() => undefined)), // permite vacío → null

    // Hora de inicio (misma para todos los turnos)
    start_time: isEdit
      ? z.string().optional()
      : z
          .string({ required_error: "La hora de inicio es obligatoria" })
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: "Formato inválido. Usa HH:MM (ej: 08:00, 14:30)",
          }),

    // Hora de fin (se calcula automáticamente, pero se valida formato)
    end_time: isEdit
      ? z.string().optional()
      : z
          .string({ required_error: "La hora de fin es obligatoria" })
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: "Formato inválido. Usa HH:MM (ej: 10:00, 16:30)",
          }),

    // ¡NUEVO! Ahora es un array de IDs de laboratorios
    laboratory_ids: z
      .array(
        z.coerce
          .number({ invalid_type_error: "ID de laboratorio inválido" })
          .int()
          .positive("ID inválido")
      )
      .min(1, "Debes seleccionar al menos un laboratorio")
      .max(50, "No puedes seleccionar más de 50 laboratorios a la vez"), // prevención

    // Tipo de ordenamiento (alfabético o por ID)
    order_type: isEdit
      ? z.enum(["alphabetical", "id_asc"]).optional()
      : z.enum(["alphabetical", "id_asc"], {
          required_error: "Debes seleccionar el tipo de ordenamiento",
          invalid_type_error: "Opción inválida",
        }),
  })
  // Validación adicional: end_time debe ser posterior a start_time
  .refine(
    (data) => {
      if (!data.start_time || !data.end_time) return true;
      const [sh, sm] = data.start_time.split(":").map(Number);
      const [eh, em] = data.end_time.split(":").map(Number);
      return eh * 60 + em > sh * 60 + sm;
    },
    {
      message: "La hora de fin debe ser posterior a la hora de inicio",
      path: ["end_time"],
    }
  );