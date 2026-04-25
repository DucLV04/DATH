const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const validator = require('../middleware/validator');
const { cleanupOnValidationError } = require('../middleware/fileCleanup');

// [UC07.1] Get current user profile
router.get(
    '/profile',
    [verifyToken],
    controller.getProfile
);

// [UC07.1] Update Display Name and/or Avatar
router.put(
    '/profile',
    [
        verifyToken,
        require('../middleware/user.upload').single('avatar'),
        cleanupOnValidationError,
        validator.updateProfileRules(),
        validator.validate
    ],
    controller.updateProfile
);

module.exports = router;