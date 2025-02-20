import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Image } from "./schema/image.schema";
import { Model } from "mongoose";
import { AwsS3Service } from "src/aws-s3/aws-s3.service";
import { User } from "src/users/schema/user.schema";
import * as sharp from "sharp";
import { TransformImageRequestDto } from "./dto/image-transformations.dto";

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<Image>,
    private readonly awsS3Service: AwsS3Service,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async processImage(
    id: string,
    userId: string,
    transformImageRequestDto: TransformImageRequestDto = {
      transformations: {},
    }
  ) {
    try {
      const transforms = transformImageRequestDto.transformations;

      const imageData = await this.imageModel.findOne({
        uuid: id,
        uploadedBy: userId,
      });
      if (!imageData) {
        throw new BadRequestException(
          "Image not found or you do not have access to this image"
        );
      }
      const filePath = `${imageData.path}`;
      const { fileBuffer } = await this.getFile(filePath, userId);

      let image = sharp(fileBuffer);
      const metadata = await image.metadata();
      let outputFormat = metadata.format;

      if (transforms.resize) {
        const resize = transforms.resize;
        image = image.resize(resize.width, resize.height);
      }

      if (transforms.crop) {
        const crop = transforms.crop;
        image = image.extract({
          width: crop.width,
          height: crop.height,
          left: crop.x,
          top: crop.y,
        });
      }

      if (transforms.rotate) {
        const angle = transforms.rotate;
        image = image.rotate(angle);
      }

      if (transforms.format) {
        const validFormats = [
          "jpeg",
          "png",
          "webp",
          "tiff",
          "gif",
          "svg",
          "avif",
        ];

        if (validFormats.includes(transforms.format)) {
          outputFormat = transforms.format;
          image = image.toFormat(outputFormat);
        } else {
          throw new BadRequestException("Invalid Image format is provided");
        }
      }

      if (transforms.filter) {
        const filter = transforms.filter;

        if (filter.greyscale) image = image.greyscale();
      }

      if (transforms.flip) {
        image = image.flip();
      }

      if (transforms.mirror) {
        image = image.flop();
      }

      if (transforms.compress) {
        const quality = transforms.compress;
        image = image.jpeg({ quality: quality }).png({ quality: quality });
      }

      if (transforms.watermark) {
        const {
          watermarkPath,
          watermarkWidth,
          watermartHeight,
          position,
          top,
          left,
        } = transforms.watermark;

        const watermark = sharp(watermarkPath)
          .resize(watermarkWidth, watermartHeight)
          .png();

        const positions = {
          "top-left": { gravity: "northwest" },
          "top-right": { gravity: "northeast" },
          "bottom-left": { gravity: "southwest" },
          "bottom-right": { gravity: "southeast" },
          center: { gravity: "center" },
        };

        let watermarkOptions;

        if (position && position.trim() !== "") {
          watermarkOptions = positions[position] || positions["bottom-right"];
        } else {
          watermarkOptions = { top: top || 0, left: left || 0 };
        }

        image = image.composite([
          { input: await watermark.toBuffer(), ...watermarkOptions },
        ]);
      }

      const transformedImageBuffer = await image.toBuffer();

      const transformedImageFile: Express.Multer.File = {
        fieldname: "file",
        originalname: `transformed-${imageData.name}`,
        encoding: "7bit",
        mimetype: `image/${outputFormat}`,
        buffer: transformedImageBuffer,
        size: transformedImageBuffer.length,
        stream: null,
        destination: "",
        filename: "",
        path: "",
      };

      return await this.addImage(transformedImageFile, userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addImage(file: Express.Multer.File, userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new BadRequestException("User Not Found");

      const fileData = await this.awsS3Service.uploadImage(file);

      const { config, uniqueId } = fileData;

      const imageData = {
        uuid: uniqueId,
        name: file.originalname,
        path: config.Key,
        url: `https://${config.Bucket}.s3.amazonaws.com/${config.Key}`,
        uploadedBy: userId,
      };

      const image = await this.imageModel.create(imageData);
      if (!image) throw new BadRequestException("Error adding image");

      const userImages = user.images;
      userImages.push(image._id);
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { ...user, userImages },
        { new: true }
      );
      if (!updatedUser)
        throw new BadRequestException("Image cannot added to the user");

      return image;
    } catch (error) {
      throw new BadRequestException(error.message + "5");
    }
  }

  async getFile(filePath: string, userId: string) {
    try {
      const file = await this.imageModel.findOne({
        path: filePath,
        uploadedBy: userId,
      });
      if (!file) {
        throw new BadRequestException(
          "File not found or you do not have access to this file"
        );
      }
      return await this.awsS3Service.getImageByFileId(filePath);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteFile(filePath: string, userId: string) {
    try {
      const image = await this.imageModel.findOne({
        path: filePath,
        uploadedBy: userId,
      });
      if (!image)
        throw new BadRequestException(
          "Image not found or you do not have access to this file"
        );

      await this.awsS3Service.deleteImageByFileId(filePath);

      await this.imageModel.findOneAndDelete({
        path: filePath,
        uploadedBy: userId,
      });

      const user = await this.userModel.findByIdAndUpdate(userId, {
        $pull: { images: image._id },
      });

      if (!user) throw new BadRequestException("User not found");

      return { message: "Image deleted successfully", image };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadFiles(files: Express.Multer.File[], userId: string) {
    if (!Array.isArray(files)) {
      throw new BadRequestException("Files must be an array");
    }

    if (files.length === 0) {
      throw new BadRequestException("At least one file must be provided");
    }

    const uploadedFiles = [];
    for (const file of files) {
      const uploadedFile = await this.addImage(file, userId);
      uploadedFiles.push(uploadedFile);
    }

    const downloadableImages = await Promise.all(
      uploadedFiles.map((file) => this.awsS3Service.getImageByFileId(file.path))
    );

    return downloadableImages;
  }
  async getFiles(filePaths: string[], userId: string) {
    if (!Array.isArray(filePaths)) {
      throw new BadRequestException("filePaths must be an array of strings");
    }

    if (filePaths.length === 0) {
      throw new BadRequestException("At least one file must be provided");
    }

    const files = await this.imageModel.find({
      path: { $in: filePaths },
      uploadedBy: userId,
    });
    if (!files.length) {
      throw new BadRequestException(
        "file not found or you do not have access to these files"
      );
    }

    const retrievedFiles = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          return await this.awsS3Service.getImageByFileId(filePath);
        } catch (error) {
          return {
            message: `Failed to retrieve file: ${filePath}`,
            filePath,
            status: "failed",
            error: error.message,
          };
        }
      })
    );
    return retrievedFiles;
  }

  async deleteFiles(filePaths: string[], userId: string) {
    if (!Array.isArray(filePaths)) {
      throw new BadRequestException("filePaths must be an array of strings");
    }
    if (filePaths.length === 0) {
      throw new BadRequestException("At least one file must be provided");
    }

    const files = await this.imageModel.find({
      path: { $in: filePaths },
      uploadedBy: userId,
    });
    if (!files.length)
      throw new BadRequestException(
        "file not found or you do not have access to these files"
      );

    const deletedFiles = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          return await this.deleteFile(filePath, userId);
        } catch (error) {
          return {
            message: `Failed to delete file: ${filePath}`,
            filePath,
            status: "failed",
            error: error.message,
          };
        }
      })
    );

    return deletedFiles;
  }
}
