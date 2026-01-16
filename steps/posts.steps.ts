import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { PostsArraySchema, PostSchema, EmptyObjectSchema, Post } from '../schemas/posts.schema';
import { API_CONSTANTS } from '../constants/api.constants';

export class PostsSteps {
    constructor(private request: APIRequestContext) { }

    /**
     * Fetches all posts and returns the response object and the start time for metrics.
     */
    async getAllPosts() {
        const startTime = Date.now();
        const response = await this.request.get(API_CONSTANTS.ENDPOINTS.POSTS);
        const duration = Date.now() - startTime;
        return { response, duration };
    }

    /**
     * Fetches posts filtered by userId
     */
    async getPostsByUserId(userId: number) {
        return await this.request.get(API_CONSTANTS.ENDPOINTS.POSTS, {
            params: { userId },
        });
    }

    /**
     * Updates an existing post (PUT)
     */
    async updatePost(id: number, payload: object) {
        return await this.request.put(`${API_CONSTANTS.ENDPOINTS.POSTS}/${id}`, {
            data: payload,
        });
    }

    /**
     * Deletes a post (DELETE)
     */
    async deletePost(id: number) {
        return await this.request.delete(`${API_CONSTANTS.ENDPOINTS.POSTS}/${id}`);
    }

    /**
     * Validate successful update
     */
    async validatePostUpdate(response: APIResponse, sentPayLoad: Partial<Post>) {
        expect(response.status(), 'Status should be 200').toBe(API_CONSTANTS.STATUS_CODES.OK);

        const body = await response.json();

        expect(body.title).toBe(sentPayLoad.title);
        expect(body.body).toBe(sentPayLoad.body);
    }

    /**
     * Validates successful delete
     * Note: JSONPlaceholder returns 200
     */
    async validateDelete(response: APIResponse) {
        const validStatuses = [API_CONSTANTS.STATUS_CODES.OK, API_CONSTANTS.STATUS_CODES.NO_CONTENT];
        expect(validStatuses, 'Status should be 200 or 204').toContain(response.status());
    }

    /**
     * Fetches a single post by ID.
     * Accepts number or string to test invalid ID inputs (TC 2.3).
     */
    async getPostById(id: number | string) {
        return await this.request.get(`${API_CONSTANTS.ENDPOINTS.POSTS}/${id}`);
    }

    /**
     * Validates status code, content-type, and performance limits
     */
    async validateGeneralResponse(response: APIResponse, duration: number) {
        expect(response.status(), 'Status code should be 200').toBe(API_CONSTANTS.STATUS_CODES.OK);

        const contentType = response.headers()[API_CONSTANTS.HEADERS.CONTENT_TYPE];
        expect(contentType, 'Content-Type header missing or incorrect').toContain(API_CONSTANTS.HEADERS.APP_JSON);

        expect(duration, `Response time should be < ${API_CONSTANTS.LIMITS.MAX_RESPONSE_TIME_MS}ms`).toBeLessThan(API_CONSTANTS.LIMITS.MAX_RESPONSE_TIME_MS);
    }

    /**
     * Sends a POST request to create a post
     */
    async createPost(payload: object) {
        return await this.request.post(API_CONSTANTS.ENDPOINTS.POSTS, {
            data: payload,
        });
    }

    /**
     * Validates successful creation
     * 1. Status 201
     * 2. ID is 101
     * 3. Response matches request
     */
    async validatePostCreation(response: APIResponse, sentPayload: Partial<Post>) {
        expect(response.status(), 'Status should be 201 Created').toBe(API_CONSTANTS.STATUS_CODES.CREATED);

        const body = await response.json();

        expect(body.id, 'New Post ID should be 101').toBe(API_CONSTANTS.TEST_DATA.CREATE_POST.EXPECTED_NEW_ID);

        expect(body.title).toBe(sentPayload.title);
        expect(body.body).toBe(sentPayload.body);
        expect(body.userId).toBe(sentPayload.userId);
    }

    /**
     * Validates API behavior on Empty Payload
     */
    async validateEmptyPayloadBehavior(response: APIResponse) {
        // This should be 400, but JSONPlaceholder returns 201 with just an ID
        expect(response.status(), 'Status should be 400 (201 in JSONPlaceholder)').toBe(API_CONSTANTS.STATUS_CODES.CREATED);

        const body = await response.json();
        expect(body.id, 'New Post ID should be 101').toBe(API_CONSTANTS.TEST_DATA.CREATE_POST.EXPECTED_NEW_ID);
    }

    /**
     * Security Check
     * Ensures that extra fields are NOT returned in the response.
     */
    async validateSecuritySchemaSanitization(response: APIResponse) {
        expect(response.status(), 'Status should be 201 Created').toBe(API_CONSTANTS.STATUS_CODES.CREATED);
        const body = await response.json();

        // Strict schema check
        try {
            PostSchema.strict().parse(body);
        } catch (error) {
            throw new Error(`Security Check Failed: Response contains unauthorized fields. \n${error}`);
        }

        expect(body, 'Response should not contain unauthorized fields').not.toHaveProperty('admin');
    }

    /**
     * Parses response body against Zod schema and validates Sort Order
     */
    async validateDataTypesAndSortOrder(response: APIResponse) {
        const body = await response.json();

        // Zod Validation (TC 1.3)
        const posts = PostsArraySchema.parse(body);

        // Sort Order Validation (TC 1.2)
        const isSorted = posts.every((post, index, array) => {
            if (index === 0) return true;
            return post.id > array[index - 1].id;
        });

        expect(isSorted, 'Posts should be sorted by ID in ascending order').toBeTruthy();
        return posts;
    }

    /**
     * Validates that all returned posts belong to the specific user
     */
    async validateFilterResults(response: APIResponse, expectedUserId: number) {
        const body = await response.json();
        const posts = PostsArraySchema.parse(body);

        expect(posts.length, 'Filter should return at least one result').toBeGreaterThan(0);

        const invalidPosts = posts.filter((post) => post.userId !== expectedUserId);
        expect(invalidPosts.length, `Found posts belonging to other users`).toBe(0);
    }

    /**
     * Validates a successful single post response (TC 2.1)
     */
    async validateSinglePostContent(response: APIResponse, expectedId: number, expectedUserId: number) {
        expect(response.status(), 'Status code should be 200').toBe(API_CONSTANTS.STATUS_CODES.OK);

        const body = await response.json();

        // 1. Validate Schema (Types + Not Empty String check via .min(1))
        const parsedPost = PostSchema.parse(body);

        // 2. Validate Specific Data Integrity
        expect(parsedPost.id, `Post ID does not match`).toBe(expectedId);
        expect(parsedPost.userId, `User ID does not match`).toBe(expectedUserId);
    }

    /**
     * Validates a 404 Not Found response (TC 2.2)
     */
    async validateNotFound(response: APIResponse) {
        expect(response.status(), 'Status should be 404').toBe(API_CONSTANTS.STATUS_CODES.NOT_FOUND);

        const body = await response.json();

        // Verify response body is empty object {}
        // Zod's .strict() ensures no other keys exist
        EmptyObjectSchema.parse(body);
    }

    /**
     * Validates graceful error handling for invalid IDs (TC 2.3)
     */
    async validateInvalidIdHandling(response: APIResponse) {
        // TC 2.3 allows for 404 OR 400.
        const validErrorCodes = [API_CONSTANTS.STATUS_CODES.NOT_FOUND, API_CONSTANTS.STATUS_CODES.BAD_REQUEST];

        expect(validErrorCodes, 'Status should be 404 or 400').toContain(response.status());
    }
}