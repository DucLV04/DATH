const db = require('../config/db.config');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

exports.fetchUserProfile = async (userId) => {
    const query = `
    SELECT id, username, email, phone_number, avatar_url, default_address, role, is_active
    FROM users
    WHERE id = $1;
  `;
    try {
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    } catch (error) {
        logger.error(`Error fetching profile for user ${userId}: ${error.message}`);
        throw error;
    }
};

exports.updateUserProfile = async (userId, updatedData) => {
    // Fetch current user to check for old avatar
    const currentUser = await exports.fetchUserProfile(userId);
    if (!currentUser) {
        throw new Error('User not found.');
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updatedData.username) {
        fields.push(`username = $${paramIndex++}`);
        values.push(updatedData.username);
    }
    if (updatedData.avatar_url) {
        fields.push(`avatar_url = $${paramIndex++}`);
        values.push(updatedData.avatar_url);

        // // [New] Delete old avatar if it exists and is a local file
        // if (currentUser.avatar_url && currentUser.avatar_url.startsWith('/uploads/')) {
        //     try {
        //         // Convert URL path to file system path
        //         // URL: /uploads/avt/filename.jpg -> File: .../DATH/uploads/avt/filename.jpg
        //         // We strip the leading slash for path.join relative to project root (or handle absolute)
        //         const filename = currentUser.avatar_url.replace(/^\//, ''); // removes leading /
        //         const filePath = path.join(__dirname, '../../', filename);

        //         // Security check: Ensure filePath is within the project directory (prevent path traversal)
        //         const resolvedPath = path.resolve(filePath);
        //         const projectRoot = path.resolve(__dirname, '../../');

        //         if (resolvedPath.startsWith(projectRoot) && fs.existsSync(resolvedPath)) {
        //             fs.unlinkSync(resolvedPath);
        //             logger.info(`Deleted old avatar: ${resolvedPath}`);
        //         } else {
        //             logger.warn(`Skipped deleting avatar: Invalid path ${filePath}`);
        //         }
        //     } catch (err) {
        //         logger.error(`Failed to delete old avatar: ${err.message}`);
        //         // Continue execution, don't fail the update
        //     }
        // }
        
    }

    if (fields.length === 0) {
        throw new Error('No valid fields provided for update.');
    }

    values.push(userId);

    const query = `
    UPDATE users
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramIndex}
    RETURNING id, username, avatar_url, email;
  `;

    try {
        const { rows } = await db.query(query, values);
        
        if (rows.length === 0) {
            throw new Error('User not found (unexpected error).');
        }

        logger.info(`Profile updated for user ${userId}. Fields: ${fields.join(', ')}`);
        return rows[0];

    } catch (error) {
        logger.error(`Error updating profile for user ${userId}: ${error.message}`);
        throw error;
    }
};

