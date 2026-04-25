/**
 * Standardized API response handler.
 * This class provides static methods to send consistent
 * success and error responses.
 */
class ApiResponse {
  /**
   * Sends a standardized success response.
   * @param {object} res - The Express response object.
   * @param {number} statusCode - The HTTP status code (e.g., 200, 201).
   * @param {string} message - A human-readable success message.
   * @param {object|array} data - The payload (data) to send.
   */
  static success(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Sends a standardized error response.
   * @param {object} res - The Express response object.
   * @param {number} statusCode - The HTTP status code (e.g., 400, 404, 500).
   * @param {string} message - A human-readable error message.
   * @param {object|array} errors - (Optional) An array of specific validation errors.
   */
  static error(res, statusCode, message, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // --- Convenience Methods ---

  /**
   * Sends a 200 OK response.
   * @param {object} res - The Express response object.
   * @param {string} message - A human-readable success message.
   * @param {object|array} data - The payload (data) to send.
   */
  static ok(res, message, data = null) {
    return this.success(res, 200, message, data);
  }

  /**
   * Sends a 201 Created response.
   * @param {object} res - The Express response object.
   * @param {string} message - A human-readable success message.
   * @param {object|array} data - The newly created resource.
   */
  static created(res, message, data = null) {
    return this.success(res, 201, message, data);
  }

  /**
   * Sends a 400 Bad Request response.
   * @param {object} res - The Express response object.
   * @param {string} message - A human-readable error message.
   * @param {object|array} errors - (Optional) An array of specific validation errors.
   */
  static badRequest(res, message, errors = null) {
    return this.error(res, 400, message, errors);
  }

  /**
   * Sends a 401 Unauthorized response.
   * @param {object} res - The Express response object.
   * @param {string} message - (Optional) A human-readable error message.
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, 401, message);
  }

  /**
   * Sends a 404 Not Found response.
   * @param {object} res - The Express response object.
   * @param {string} message - (Optional) A human-readable error message.
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  /**
   * Sends a 500 Internal Server Error response.
   * @param {object} res - The Express response object.
   * @param {string} message - A human-readable error message.
   */
  static serverError(res, message) {
    return this.error(res, 500, message);
  }
}

module.exports = ApiResponse;