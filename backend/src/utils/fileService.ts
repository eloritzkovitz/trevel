import fs from 'fs';
import path from 'path';

/**
 * Saves a base64-encoded image to the uploads folder.
 * @param base64Data - The base64 image string (with or without data URL prefix).
 * @param filename - The filename to save as (e.g., "image.jpg").
 * @returns The relative URL path to the saved image.
 */
export const saveBase64Image = (base64Data: string, filename: string): string => {
    const matches = base64Data.match(/^data:image\/\w+;base64,(.+)$/);
    const imageBuffer = Buffer.from(matches ? matches[1] : base64Data, 'base64');
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, imageBuffer);
    return `/uploads/${filename}`;
};

/**
 * Resolves the full path to a file based on the provided relative path.
 * @param relativePath - The relative path to the file (e.g., /uploads/x.jpg).
 * @returns The full path to the file.
 */
export const resolveFilePath = (relativePath: string): string => {
    const rel = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return path.join(__dirname, '../../', rel);
};

/**
 * Deletes a file from the filesystem.
 * @param filePath - The path to the file to be deleted.
 */
export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        await fs.promises.unlink(filePath);
        console.log(`File deleted: ${filePath}`);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.log(`File not found (not deleted): ${filePath}`);
        } else {
            console.warn(`Error deleting file ${filePath}:`, err);
        }
    }
};