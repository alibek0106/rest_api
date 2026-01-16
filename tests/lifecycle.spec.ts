import { test, expect } from '../fixtures/test.fixture';
import { PostFactory } from '../utils/post.factory';
import { API_CONSTANTS } from '../constants/api.constants';

test.describe('E2E: Post Lifecycle Management', () => {
    test('Full Lifecycle: Create -> Read -> Update -> Verify -> Delete -> Check', async ({ postsSteps }) => {
        // Create
        const createPayload = PostFactory.createRandomPostPayload();
        const createResponse = await postsSteps.createPost(createPayload);
        await postsSteps.validatePostCreation(createResponse, createPayload);

        // Extract ID
        const createdBody = await createResponse.json();
        const postId = createdBody.id;

        // Read
        const readResponse = await postsSteps.getPostById(postId);

        //JSONPlaceholder does not actually save the new post, so we handle the mock limitations here
        if (postId === 101) {
            expect(readResponse.status(), 'Status should be 404 Not Found').toBe(API_CONSTANTS.STATUS_CODES.NOT_FOUND);
        } else {
            await postsSteps.validateSinglePostContent(readResponse, postId, createPayload.userId);
        }

        // Update (PUT)
        const targetIdForUpdate = postId === 101 ? 1 : postId;
        const updatePayload = PostFactory.createRandomPostPayload();
        updatePayload.title = 'UPDATED: ' + updatePayload.title;

        const updateResponse = await postsSteps.updatePost(targetIdForUpdate, updatePayload);
        await postsSteps.validatePostUpdate(updateResponse, updatePayload);

        // Verify update
        const verifyUpdateResponse = await postsSteps.getPostById(targetIdForUpdate);
        const verifyBody = await verifyUpdateResponse.json();

        // JSONPlaceholder foes not persist updates.
        // In a real app, verifyBody.title should equal updatePayload.title
        if (targetIdForUpdate === 1) {
            expect(verifyBody.title, 'JSONPlaceholder does not persist PUTs.').not.toBe(updatePayload.title);
        } else {
            expect(verifyBody.title, 'Title should match updated title').toBe(updatePayload.title);
        }

        // Delete
        const deleteResponse = await postsSteps.deletePost(targetIdForUpdate);
        await postsSteps.validateDelete(deleteResponse);

        // Verify delete
        const finalCheckResponse = await postsSteps.getPostById(targetIdForUpdate);

        // JSONPlaceholder does not actually delete the resource
        if (targetIdForUpdate === 1) {
            expect(finalCheckResponse.status(), 'JSONPlaceholder should not be persisting DELETEs').toBe(API_CONSTANTS.STATUS_CODES.OK);
        } else {
            expect(finalCheckResponse.status(), 'Status should be 404 Not Found').toBe(API_CONSTANTS.STATUS_CODES.NOT_FOUND);
        }
    });
});
