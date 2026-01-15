import { test } from '../fixtures/test.fixture';
import { API_CONSTANTS } from '../constants/api.constants';

test.describe('GET /posts/{id} API Tests', () => {

    test('TC 2.1: Verify Get Post 99 (Valid)', async ({ postsSteps }) => {
        const { VALID_ID, EXPECTED_USER_ID } = API_CONSTANTS.TEST_DATA.POST_BY_ID;

        const response = await postsSteps.getPostById(VALID_ID);

        await postsSteps.validateSinglePostContent(response, VALID_ID, EXPECTED_USER_ID);
    });

    test('TC 2.2: Verify Not Found (ID 150)', async ({ postsSteps }) => {
        const { NOT_FOUND_ID } = API_CONSTANTS.TEST_DATA.POST_BY_ID;

        const response = await postsSteps.getPostById(NOT_FOUND_ID);

        await postsSteps.validateNotFound(response);
    });

    test('TC 2.3: Verify Invalid ID (String Input)', async ({ postsSteps }) => {
        const { INVALID_ID_STRING } = API_CONSTANTS.TEST_DATA.POST_BY_ID;

        const response = await postsSteps.getPostById(INVALID_ID_STRING);

        await postsSteps.validateInvalidIdHandling(response);
    });

});