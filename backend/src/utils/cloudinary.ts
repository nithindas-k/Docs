import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary and return the secure URL
 * @param fileBuffer - Buffer of the file to upload
 * @param fileName - Name of the file for reference
 * @param folder - Cloudinary folder path (default: 'lockr')
 * @returns Promise with secure_url from Cloudinary
 */
async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'lockr'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: `${Date.now()}_${fileName.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID of the file to delete
 */
async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.error(`Failed to delete from Cloudinary: ${error.message}`);
    // Don't throw - continue even if deletion fails
  }
}

export { uploadToCloudinary, deleteFromCloudinary };
