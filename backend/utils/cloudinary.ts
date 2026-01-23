import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'medicare_avatars',
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result.secure_url);
                return reject(new Error('Cloudinary upload failed'));
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export default cloudinary;
