const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure upload directory
const uploadDir = path.join(__dirname, '../../uploads/avt');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const crypto = require('crypto');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate secure filename using hash
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const hash = crypto.createHash('md5').update(file.originalname + uniqueSuffix).digest('hex');
        cb(null, hash + path.extname(file.originalname));
    },
});

// File filter (Images only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

module.exports = upload;
