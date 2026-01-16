import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { User, UsersArraySchema } from '../schemas/users.schema';
import { API_CONSTANTS } from '../constants/api.constants';

export class UsersSteps {
    constructor(private request: APIRequestContext) { }

    async getAllUsers() {
        return await this.request.get(API_CONSTANTS.ENDPOINTS.USERS);
    }

    /**
     * TC 4.1: Validate Status and Count
     */
    async validateUserCount(response: APIResponse) {
        expect(response.status()).toBe(API_CONSTANTS.STATUS_CODES.OK);
        const body = await response.json();

        // Parse Schema to ensure array structure
        const users = UsersArraySchema.parse(body);

        expect(users.length, 'User count should be exactly 10').toBe(API_CONSTANTS.TEST_DATA.USERS.EXPECTED_COUNT);
        return users;
    }

    /**
     * TC 4.2: Deep Data Match
     * Finds a specific user and compares every nested field strictly.
     */
    async validateUserDeepMatch(users: User[], expectedData: User) {
        const foundUser = users.find(u => u.id === expectedData.id);

        expect(foundUser, `User with ID ${expectedData.id} should exist`).toBeDefined();

        if (!foundUser) return;

        // Playwright's expect.toEqual performs a deep strict equality check
        // This validates Address, Geo, and Company automatically
        expect(foundUser).toEqual(expectedData);
    }

    /**
     * TC 4.3: Data Range Validation
     * Iterates through ALL users to validate Geo coordinates
     */
    async validateGeoCoordinates(users: User[]) {
        const { LAT_MIN, LAT_MAX, LNG_MIN, LNG_MAX } = API_CONSTANTS.LIMITS.GEO;

        users.forEach(user => {
            const lat = parseFloat(user.address.geo.lat);
            const lng = parseFloat(user.address.geo.lng);

            expect(lat, `User ${user.id} Lat ${lat} out of range`).toBeGreaterThanOrEqual(LAT_MIN);
            expect(lat, `User ${user.id} Lat ${lat} out of range`).toBeLessThanOrEqual(LAT_MAX);

            expect(lng, `User ${user.id} Lng ${lng} out of range`).toBeGreaterThanOrEqual(LNG_MIN);
            expect(lng, `User ${user.id} Lng ${lng} out of range`).toBeLessThanOrEqual(LNG_MAX);
        });
    }
}