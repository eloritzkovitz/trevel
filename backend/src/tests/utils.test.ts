import fs from 'fs';
import path from 'path';
import { deleteFile, resolveFilePath } from '../utils/fileService';

jest.mock('fs');

describe('fileService', () => {
  const testFilePath = 'uploads/test.txt';
  const resolvedPath = path.join(__dirname, '../../', 'uploads/test.txt');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteFile', () => {
    it('should delete a file if it exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      deleteFile(testFilePath);

      expect(fs.existsSync).toHaveBeenCalledWith(resolvedPath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(resolvedPath);
    });

    it('should not throw an error if the file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(() => deleteFile(testFilePath)).not.toThrow();
      expect(fs.existsSync).toHaveBeenCalledWith(resolvedPath);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });

  describe('resolveFilePath', () => {
    it('should resolve the full path to a file based on the provided relative path', () => {
      const relativePath = 'uploads/test.txt';
      const expectedPath = path.join(__dirname, '../../', 'uploads/test.txt');

      const result = resolveFilePath(relativePath);

      expect(result).toBe(expectedPath);
    });

    it('should handle an empty relative path', () => {
      const result = resolveFilePath('');

      expect(result).toBe('');
    });
  });
});