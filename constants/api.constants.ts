export const API_CONSTANTS = {
    ENDPOINTS: {
        POSTS: '/posts',
        USERS: '/users',
    },
    HEADERS: {
        CONTENT_TYPE: 'content-type',
        APP_JSON: 'application/json',
    },
    LIMITS: {
        MAX_RESPONSE_TIME_MS: 800,
        GEO: {
            LAT_MIN: -90,
            LAT_MAX: 90,
            LNG_MIN: -180,
            LNG_MAX: 180,
        }
    },
    TEST_DATA: {
        TARGET_USER_ID: 1,
        POST_BY_ID: {
            VALID_ID: 99,
            EXPECTED_USER_ID: 10,
            NOT_FOUND_ID: 150,
            INVALID_ID_STRING: 'abc',
        },
        CREATE_POST: {
            EXPECTED_NEW_ID: 101,
        },
        USERS: {
            EXPECTED_COUNT: 10,
        }
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