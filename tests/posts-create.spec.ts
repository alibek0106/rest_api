import { test } from '../fixtures/test.fixture';
import { PostFactory } from '../utils/post.factory';

test.describe('POST /posts API Tests', () => {
    test('TC 3.1: Verify Create Post (Status 201, Echo, ID check)', async ({ postsSteps }) => {
        const newPostData = PostFactory.createRandomPostPayload();
        const response = await postsSteps.createPost(newPostData);
        await postsSteps.validatePostCreation(response, newPostData);
    });

    test('TC 3.2: Verify Empty Payload Handling', async ({ postsSteps }) => {
        const emptyPayload = {};

        const response = await postsSteps.createPost(emptyPayload);

        await postsSteps.validateEmptyPayloadBehavior(response);
    });

    test('TC 3.3: Verify Security Check (Extra Fields Stripped)', async ({ postsSteps }) => {
        // Annotation: I mark this as a"fail" because JSONPlaceholder strictly echoes back all fields,
        // violating the security requirement. If the aPI is ever fixed (stops returning 'admin'),
        // this test will 'fail' (unexpectedly pass), alerting us to remove this annotation.
        test.fail();
        const maliciousPayload = PostFactory.createPostWithSecurityInjection();

        const response = await postsSteps.createPost(maliciousPayload);

        await postsSteps.validateSecuritySchemaSanitization(response);
    });
});