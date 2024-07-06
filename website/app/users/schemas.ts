
  import { z } from 'zod';
  
  export const userSchema = z.object({
    id: z.string().uuid(),
    image: z.string().url(),
    name: z.string().max(50),
    email: z.string().email(),
    age: z.number().min(18)
  });
  export type UserSchema = z.infer<typeof userSchema>;
  
  export const createUserInputSchema = userSchema.omit({ id: true });
  export type CreateUserInputSchema = z.infer<typeof createUserInputSchema>;
  
  export const updateUserInputSchema = userSchema;
  export type UpdateUserInputSchema = z.infer<typeof updateUserInputSchema>;
  
  export const deleteUserInputSchema = z.object({ id: z.string() });
  export type DeleteUserInputSchema = z.infer<typeof deleteUserInputSchema>;
  