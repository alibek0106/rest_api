import { z } from 'zod';

export const PostSchema = z.object({
    userId: z.number(),
    id: z.number(),
    title: z.string().min(1, { message: 'Title cannot be empty' }),
    body: z.string().min(1, { message: "Body cannot be empty" }),
}).strict();

export type Post = z.infer<typeof PostSchema>;
export const PostsArraySchema = z.array(PostSchema);
export const EmptyObjectSchema = z.object({}).strict();