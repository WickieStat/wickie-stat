import { z } from "zod";
import { EMAIL_RE, PHONE_RE } from "./enquiryFlow";

const clean = (max: number) => z.string().trim().max(max).transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ""));

export const ChatRequestSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: clean(2000) }))
    .min(1)
    .max(30),
});

export const EnquirySchema = z.object({
  name: clean(100).pipe(z.string().min(2, "Please enter your full name.")),
  email: clean(200).pipe(z.string().regex(EMAIL_RE, "Please enter a valid email address.")),
  whatsapp: clean(20).pipe(z.string().regex(PHONE_RE, "Please enter a valid WhatsApp number with country code.")),
  service: clean(120).pipe(z.string().min(2, "Please choose a service.")),
  description: clean(2000).pipe(z.string().min(10, "Please describe your project in a sentence or two.")),
  timeline: clean(100).pipe(z.string().min(2, "Please give a rough timeline.")),
  budget: clean(100).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to the privacy notice so we can process your enquiry." }) }),
  includeTranscript: z.boolean().optional().default(false),
  transcript: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: clean(2000) }))
    .max(40)
    .optional(),
  source: z.enum(["chatbot", "contact_form"]),
  /** Honeypot — real visitors never fill this. */
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;
