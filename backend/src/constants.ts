export const ROUTES = {
  AUTH: {
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
    PROFILE: "/auth/profile"
  },
  CATEGORY: {
    BASE: "/categories",
    ID: "/categories/:id"
  },
  ITEM: {
    BASE: "/items",
    ID: "/items/:id",
    CATEGORY: "/items/category/:categoryId"
  },
  PERSON: {
    BASE: "/persons",
    ID: "/persons/:id"
  }
};

export const MESSAGES = {
  SUCCESS: "Operation successful",
  CREATED: "Resource created successfully",
  DELETED: "Resource deleted successfully",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
  VALIDATION_ERROR: "Validation error"
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
