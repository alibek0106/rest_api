import { test as base } from '@playwright/test';
import { PostsSteps } from '../steps/posts.steps';
import { UsersSteps } from '../steps/users.steps';

type MyFixtures = {
    postsSteps: PostsSteps;
    usersSteps: UsersSteps;
};

export const test = base.extend<MyFixtures>({
    postsSteps: async ({ request }, use) => {
        const steps = new PostsSteps(request);
        await use(steps);
    },
    usersSteps: async ({ request }, use) => {
        await use(new UsersSteps(request));
    },
});

export { expect } from '@playwright/test';