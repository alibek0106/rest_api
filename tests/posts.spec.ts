import { test } from '../fixtures/test.fixture';
import { API_CONSTANTS } from '../constants/api.constants';

test.describe('GET /posts API Tests', () => {
    test('TC 1.1: Verify Response Status, Headers, and Performance', async ({ postsSteps }) => {
        const { response, duration } = await postsSteps.getAllPosts();
        await postsSteps.validateGeneralResponse(response, duration);
    });

    test('TC 1.2 & 1.3: Verify Data Types and Sort Order', async ({ postsSteps }) => {
        const { response } = await postsSteps.getAllPosts();

        await postsSteps.validateGeneralResponse(response, 0);

        await postsSteps.validateDataTypesAndSortOrder(response);
    });

    test('TC 1.4: Verify Filter Logic', async ({ postsSteps }) => {
        const targetUser = API_CONSTANTS.TEST_DATA.TARGET_USER_ID;

        const response = await postsSteps.getPostsByUserId(targetUser);
        await postsSteps.validateFilterResults(response, targetUser);
    });
});