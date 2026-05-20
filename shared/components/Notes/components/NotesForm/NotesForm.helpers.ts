import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const notesFormInitialValues: { note: string } = {
  note: "",
};

export const notesFormValidationSchema: z.ZodType<{ note: string }> = z.object({
  note: z
    .string({
      required_error: "Cannot create an empty note.",
    })
    .max(1024, { message: "Your note must be less than 1024 characters" }),
});

export type TNotesFormValidationSchema = z.infer<typeof notesFormValidationSchema>;

export const notesFormZodResolver = zodResolver(notesFormValidationSchema);
