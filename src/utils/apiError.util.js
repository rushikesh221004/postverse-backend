class ApiError extends Error {
  /**
   * Custom error class for API responses.
   * @param {number} statusCode - HTTP status code (e.g., 400, 500).
   * @param {string} message - Error message to be sent in the response.
   * @param {Array} errors - Array of error details (optional).
   * @param {string} stack - Custom stack trace (optional).
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message); // Call the parent class (Error) constructor
    this.statusCode = statusCode; // HTTP status code
    this.message = message; // Error message
    this.success = false; // Indicates if the request was successful
    this.errors = errors; // Additional error details (if any)

    // Capture stack trace for debugging purposes
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Method to convert the error object to a plain object for serialization
  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      errors: this.errors,
    };
  }
}

export { ApiError };