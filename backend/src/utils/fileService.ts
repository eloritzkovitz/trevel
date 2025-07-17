import fs from 'fs';
import path from 'path';

/**
 * Deletes a file from the filesystem.
 * @param filePath - The path to the file to be deleted.
 */
export const deleteFile = (filePath: string): void => {
    const resolvedPath = resolveFilePath(filePath);
    if (fs.existsSync(resolvedPath)) fs.unlinkSync(resolvedPath);  
};

/**
 * Resolves the full path to a file based on the provided relative path.
 * @param relativePath - The relative path to the file (e.g., /uploads/x.jpg).
 * @returns The full path to the file.
 */
export const resolveFilePath = (relativePath: string): string => {
    // Remove leading slash if present
    const rel = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return path.join(__dirname, '../../', rel);
};