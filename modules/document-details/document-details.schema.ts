import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const documentDetailsSchema = z.object({
  summary_title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(150, { message: "Title must be less than 150 characters" }),
  category: z
    .string()
    .min(1, { message: "Category is required" })
    .max(50, { message: "Category must be less than 50 characters" }),
  summary: z
    .string()
    .min(5, { message: "Summary must be at least 5 characters" })
    .max(5000, { message: "Summary must be less than 5000 characters" }),
  tags: z
    .string()
    .min(1, { message: "At least one tag is required" })
    .max(200, { message: "Tags must be less than 200 characters" }),
});

export type TDocumentDetailsForm = z.infer<typeof documentDetailsSchema>;

export const documentDetailsZodResolver = zodResolver(documentDetailsSchema);
