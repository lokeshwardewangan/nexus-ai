import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters")
    .regex(/^[a-z0-9_]+$/, "Only letters, numbers, and underscores")
    .regex(/[a-z]/, "Include at least one letter"),
  headline: z.string().trim().max(80, "Keep this under 80 characters"),
  bio: z.string().trim().max(280, "Bio must be under 280 characters"),
});

export type ProfileFormInput = z.infer<typeof profileSchema>;
