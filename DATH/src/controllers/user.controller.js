const userService = require('../services/user.service');
const ApiResponse = require('../utils/api.response');
const logger = require('../utils/logger');

// [UC07.1] Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const profile = await userService.fetchUserProfile(userId);

        if (!profile) {
            return ApiResponse.notFound(res, 'User profile not found.');
        }

        return ApiResponse.ok(res, 'Profile retrieved successfully', profile);
    } catch (error) {
        logger.error(`getProfile Error: ${error.message}`);
        return ApiResponse.serverError(res, 'Failed to fetch user profile');
    }
};

// [UC07.1] Update Display Name and Avatar
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const { username } = req.body;
        let avatar_url;

        if (req.file) {
            // If file uploaded, use the relative path
            // Replace backslashes with forward slashes for URL compatibility
            // Add leading slash to match product upload logic
            avatar_url = `/uploads/avt/${req.file.filename}`.replace(/\\/g, '/');
        } else if (req.body.avatar_url) {
            // Fallback if avatar_url is sent in body (rare in form-data but harmless)
            avatar_url = req.body.avatar_url;
        }

        const updatedData = {};
        if (username) updatedData.username = username;
        if (avatar_url) updatedData.avatar_url = avatar_url;

        const updatedProfile = await userService.updateUserProfile(userId, updatedData);

        return ApiResponse.ok(res, 'Profile updated successfully', updatedProfile);
    } catch (error) {
        logger.error(`updateProfile Error: ${error.message}`);
        return ApiResponse.serverError(res, 'Failed to update profile');
    }
};
