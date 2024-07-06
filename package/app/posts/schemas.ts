
import { z } from 'zod';

export const postSchema = z.object({
  id: z.string(),
title: z.string().min(10).max(100),
content: z.string(),
visibility: z.enum(["public", "sub", "none"])
});
export type PostSchema = z.infer<typeof postSchema>;

export const createPostInputSchema = postSchema.omit({ id: true });
export type CreatePostInputSchema = z.infer<typeof createPostInputSchema>;

export const updatePostInputSchema = postSchema;
export type UpdatePostInputSchema = z.infer<typeof updatePostInputSchema>;

export const deletePostInputSchema = z.object({ id: z.string() });
export type DeletePostInputSchema = z.infer<typeof deletePostInputSchema>;
    