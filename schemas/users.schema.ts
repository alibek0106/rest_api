import { z } from 'zod';

export const GeoSchema = z.object({
    lat: z.string(),
    lng: z.string(),
});

export const AddressSchema = z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: GeoSchema,
});

export const CompanySchema = z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
});

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    email: z.email(),
    address: AddressSchema,
    phone: z.string(),
    website: z.string(),
    company: CompanySchema,
});

export const UsersArraySchema = z.array(UserSchema);
export type User = z.infer<typeof UserSchema>;