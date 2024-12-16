
import { z } from "zod";

export const AcademicManagementCareerSchema = z.object({
    career_id: z.string({ required_error: "La carrera es obligatoria" }),
    academic_management_id: z.string({ required_error: "La gestion es obligatoria" }),
})




