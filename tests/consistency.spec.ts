import { test, expect } from '../fixtures/test.fixture';
import { API_CONSTANTS } from '../constants/api.constants';

test.describe('Part 5: Data Consistency & Chaining', () => {

    const targetId = API_CONSTANTS.TEST_DATA.CONSISTENCY.TARGET_USER_ID;

    test('TC 5.1: Cross-Check User 5 (List vs Detail View)', async ({ usersSteps }) => {
        // Get All Users and find the specific user
        const listResponse = await usersSteps.getAllUsers();
        const allUsers = await usersSteps.validateUserCount(listResponse);

        const userFromList = allUsers.find(u => u.id === targetId);
        expect(userFromList, `User ${targetId} should exist in list`).toBeDefined();

        // Call GET /users/5 directly
        const detailResponse = await usersSteps.getUserById(targetId);

        // Compare them strictly
        await usersSteps.validateUserConsistency(userFromList!, detailResponse);
    });

    test('TC 5.2: Rational Check (User -> Posts Chaining)', async ({ usersSteps, postsSteps }) => {
        // Fetch User to confirm existence
        const userResponse = await usersSteps.getUserById(targetId);
        expect(userResponse.status(), 'Status code should be 200 OK').toBe(API_CONSTANTS.STATUS_CODES.OK);

        // Use the ID from that user to fetch theit posts
        const userBody = await userResponse.json();
        const dynamicUserId = userBody.id;

        const postsResponse = await postsSteps.getPostsByUserId(dynamicUserId);

        // Verify the posts belong to that user
        await postsSteps.validateFilterResults(postsResponse, dynamicUserId);
    });
});