import { z } from "zod"

export const profileBusinessSchema = z
  .object({
    cnpj: z
      .string()
      .refine((val) => val.replace(/\D/g, "").length === 14, "CNPJ inválido.")
      .transform((val) => val.replace(/\D/g, "")),
    displayName: z.string().min(1, 'O nome é obrigatório.'),
    phone: z.string()
      .refine(val => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      }, "Telefone inválido.")
      .transform(val => val.replace(/\D/g, "")),
  })
