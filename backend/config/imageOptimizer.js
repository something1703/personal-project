const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { logInfo, logError, logWarning } = require('./logger');

// Configure storage
const storage = multer.memoryStorage(); // Use memory storage for processing

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: fileFilter
});

// Image compression options
const compressionOptions = {
    thumbnail: {
        width: 150,
        height: 150,
        quality: 80
    },
    medium: {
        width: 800,
        height: 600,
        quality: 85
    },
    large: {
        width: 1920,
        height: 1080,
        quality: 90
    }
};

/**
 * Compress and optimize image
 * @param {Buffer} buffer - Image buffer
 * @param {string} size - Size preset (thumbnail, medium, large)
 * @param {string} format - Output format (jpeg, png, webp)
 * @returns {Promise<Buffer>} Compressed image buffer
 */
const compressImage = async (buffer, size = 'medium', format = 'jpeg') => {
    try {
        const options = compressionOptions[size] || compressionOptions.medium;

        let sharpInstance = sharp(buffer)
            .resize(options.width, options.height, {
                fit: 'inside',
                withoutEnlargement: true
            });

        // Apply format-specific compression
        switch (format) {
            case 'jpeg':
            case 'jpg':
                sharpInstance = sharpInstance.jpeg({
                    quality: options.quality,
                    progressive: true,
                    mozjpeg: true
                });
                break;
            case 'png':
                sharpInstance = sharpInstance.png({
                    quality: options.quality,
                    compressionLevel: 9,
                    progressive: true
                });
                break;
            case 'webp':
                sharpInstance = sharpInstance.webp({
                    quality: options.quality
                });
                break;
            default:
                sharpInstance = sharpInstance.jpeg({ quality: options.quality });
        }

        return await sharpInstance.toBuffer();

    } catch (error) {
        logError(error, { context: 'IMAGE_COMPRESSION' });
        throw new Error('Image compression failed');
    }
};

/**
 * Save compressed image to disk
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Filename
 * @param {string} uploadDir - Upload directory
 * @returns {Promise<string>} File path
 */
const saveImage = async (buffer, filename, uploadDir = 'uploads') => {
    try {
        // Create upload directory if it doesn't exist
        const fullPath = path.join(__dirname, '..', uploadDir);
        await fs.mkdir(fullPath, { recursive: true });

        // Generate unique filename
        const hash = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        const newFilename = `${name}_${hash}${ext}`;
        const filePath = path.join(fullPath, newFilename);

        // Save file
        await fs.writeFile(filePath, buffer);

        logInfo('Image saved', { filename: newFilename, path: uploadDir });

        return path.join(uploadDir, newFilename).replace(/\\/g, '/');

    } catch (error) {
        logError(error, { context: 'SAVE_IMAGE' });
        throw new Error('Failed to save image');
    }
};

/**
 * Process and save image in multiple sizes
 * @param {Buffer} buffer - Original image buffer
 * @param {string} filename - Original filename
 * @param {string} uploadDir - Upload directory
 * @returns {Promise<Object>} Paths to all saved images
 */
const processAndSaveImage = async (buffer, filename, uploadDir = 'uploads') => {
    try {
        const results = {};

        // Process different sizes
        for (const [size, options] of Object.entries(compressionOptions)) {
            const compressed = await compressImage(buffer, size, 'jpeg');
            const savedPath = await saveImage(compressed, `${size}_${filename}`, uploadDir);
            results[size] = savedPath;
        }

        // Also save WebP version for modern browsers
        const webpBuffer = await compressImage(buffer, 'medium', 'webp');
        const webpPath = await saveImage(webpBuffer, filename.replace(/\.[^.]+$/, '.webp'), uploadDir);
        results.webp = webpPath;

        logInfo('Image processed successfully', { filename, sizes: Object.keys(results) });

        return results;

    } catch (error) {
        logError(error, { context: 'PROCESS_AND_SAVE_IMAGE' });
        throw new Error('Image processing failed');
    }
};

/**
 * Delete image file
 * @param {string} filePath - Path to image file
 */
const deleteImage = async (filePath) => {
    try {
        const fullPath = path.join(__dirname, '..', filePath);
        await fs.unlink(fullPath);
        logInfo('Image deleted', { path: filePath });
    } catch (error) {
        logWarning('Failed to delete image', { path: filePath, error: error.message });
    }
};

/**
 * Get image metadata
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Object>} Image metadata
 */
const getImageMetadata = async (buffer) => {
    try {
        const metadata = await sharp(buffer).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: metadata.size,
            hasAlpha: metadata.hasAlpha,
            space: metadata.space
        };
    } catch (error) {
        logError(error, { context: 'GET_IMAGE_METADATA' });
        throw new Error('Failed to get image metadata');
    }
};

module.exports = {
    upload,
    compressImage,
    saveImage,
    processAndSaveImage,
    deleteImage,
    getImageMetadata,
    compressionOptions
};
