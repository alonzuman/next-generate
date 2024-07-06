
  import { z } from 'zod';
  
  export const postSchema = z.object({
    id: z.string().cuid(),
    title: z.string().max(50),
    body: z.string().max(1024)
  });
  export type PostSchema = z.infer<typeof postSchema>;
  
  export const createPostInputSchema = postSchema.omit({ id: true });
  export type CreatePostInputSchema = z.infer<typeof createPostInputSchema>;
  
  export const updatePostInputSchema = postSchema;
  export type UpdatePostInputSchema = z.infer<typeof updatePostInputSchema>;
  
  export const deletePostInputSchema = z.object({ id: z.string() });
  export type DeletePostInputSchema = z.infer<typeof deletePostInputSchema>;
  