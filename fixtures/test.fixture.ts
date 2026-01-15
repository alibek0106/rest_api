import { test as base } from '@playwright/test';
import { PostsSteps } from '../steps/posts.steps';

type MyFixtures = {
    postsSteps: PostsSteps;
};

export const test = base.extend<MyFixtures>({
    postsSteps: async ({ request }, use) => {
        const steps = new PostsSteps(request);
        await use(steps);
    },
});

export { expect } from '@playwright/test';