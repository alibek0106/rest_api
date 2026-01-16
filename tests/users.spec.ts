import { test } from '../fixtures/test.fixture';
import expectedUser5 from '../data/user5.json';

test.describe('GET /users API Tests', () => {

    test('TC 4.1: Verify Get All Users (Status 200, Count 10)', async ({ usersSteps }) => {
        const response = await usersSteps.getAllUsers();
        await usersSteps.validateUserCount(response);
    });

    test('TC 4.2: Verify Deep Data Match (User 5)', async ({ usersSteps }) => {
        const response = await usersSteps.getAllUsers();

        // We get the strongly typed array of users
        const users = await usersSteps.validateUserCount(response);

        // Perform Deep Validation
        await usersSteps.validateUserDeepMatch(users, expectedUser5);
    });

    test('TC 4.3: Verify Geo Data Range (-90 to 90, -180 to 180)', async ({ usersSteps }) => {
        const response = await usersSteps.getAllUsers();
        const users = await usersSteps.validateUserCount(response);

        // Loop through all 10 users and validate their coordinates
        await usersSteps.validateGeoCoordinates(users);
    });

});