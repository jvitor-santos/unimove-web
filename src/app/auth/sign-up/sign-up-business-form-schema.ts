import { z } from "zod"

export const signUpBusinessSchema = z
  .object({
    cnpj: z
      .string()
      .refine((val) => val.replace(/\D/g, "").length === 14, "CNPJ inválido.")
      .transform((val) => val.replace(/\D/g, "")),
    displayName: z.string().min(1, 'O nome é obrigatório.'),
    email: z
      .string()
      .min(1, 'O email é obrigatório.')
      .email('O formato do email é inválido.'),
    phone: z.string()
      .refine(val => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      }, "Telefone inválido.")
      .transform(val => val.replace(/\D/g, "")),
    password: z
      .string()
      .min(1, 'A senha é obrigatória.')
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra.')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
      .regex(
        /[^A-Za-z0-9]/,
        'A senha deve conter pelo menos um caractere especial.',
      ),
    confirmpPassword: z.string().min(1, 'A confirmação de senha é obrigatória.'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmpPassword) {
      ctx.addIssue({
        message: 'As senhas não correspondem.',
        path: ['confirmpPassword'],
        code: 'custom',
      })
    }
  })