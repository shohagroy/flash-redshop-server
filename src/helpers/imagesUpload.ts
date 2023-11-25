import { config } from "../config/cloudinary";

import { v2 as cloudinary } from "cloudinary";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

export default async (blobImages: string[]) => {
  cloudinary.config(config);

  const files = blobImages;

  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file: string) => {
        const result = await cloudinary.uploader.upload(file, {
          folder: "flash_redshop",
          resource_type: "image",
          access_mode: "public",
          allowed_formats: ["jpg", "png", "webp"],
          use_filename: true,
        });

        const image = {
          secure_url: result.secure_url,
          public_id: result.public_id,
        };

        return image;
      })
    );

    return uploadedFiles;
  } catch (error) {
    console.log(error);
    new ApiError(httpStatus.BAD_REQUEST, "Error uploading images");
    return [];
  }
};
