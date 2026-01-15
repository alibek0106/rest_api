export const API_CONSTANTS = {
    ENDPOINTS: {
        POSTS: '/posts',
    },
    HEADERS: {
        CONTENT_TYPE: 'content-type',
        APP_JSON: 'application/json',
    },
    LIMITS: {
        MAX_RESPONSE_TIME_MS: 800,
    },
    TEST_DATA: {
        TARGET_USER_ID: 1,
        POST_BY_ID: {
            VALID_ID: 99,
            EXPECTED_USER_ID: 10,
            NOT_FOUND_ID: 150,
            INVALID_ID_STRING: 'abc',
        },
    },
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },
};