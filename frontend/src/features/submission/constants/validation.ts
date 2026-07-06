export const VALIDATION_LIMITS = {
  TITLE: {
    MIN: 10,
    MAX: 100,
  },
  DESCRIPTION: {
    MIN: 30,
    MAX: 1000,
  },
  MOBILE_REGEX: /^[6-9]\d{9}$/, // Indian 10-digit mobile number format
};

export const ERROR_MESSAGES = {
  TITLE_REQUIRED: "Issue title is required.",
  TITLE_LENGTH: `Title must be between ${VALIDATION_LIMITS.TITLE.MIN} and ${VALIDATION_LIMITS.TITLE.MAX} characters.`,
  DESCRIPTION_REQUIRED: "Issue description is required.",
  DESCRIPTION_LENGTH: `Description must be between ${VALIDATION_LIMITS.DESCRIPTION.MIN} and ${VALIDATION_LIMITS.DESCRIPTION.MAX} characters.`,
  CATEGORY_REQUIRED: "Please select a category.",
  LANGUAGE_REQUIRED: "Please select your preferred language.",
  MOBILE_INVALID: "Please enter a valid 10-digit mobile number.",
};
