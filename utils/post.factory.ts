import { faker } from '@faker-js/faker';

export const PostFactory = {
    /**
     * Generate a valid random Post payload
     */
    createRandomPostPayload: () => {
        return {
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(2),
            userId: faker.number.int({ min: 1, max: 100 }),
        };
    },

    /**
     * Generates a payload with an extra unauthorized field
     */
    createPostWithSecurityInjection: () => {
        return {
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph(),
            userId: 1,
            admin: true,
        };
    },
};