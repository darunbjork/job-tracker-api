import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    jobUrl: z.string().url("Invalid job URL"),
    status: z.enum(["BookMarked", "Applied", "Interview", "Offer", "Rejected"]),
    matchScore: z.number().min(1).max(10),
    dateApplied: z.string().optional(),
  }),
});