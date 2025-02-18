import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Readable } from "stream";

@Injectable()
export class AwsS3Service {
  private bucketName;
  private s3storage;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.s3storage = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadImage(filePath: string, file: Buffer) {
    if (!filePath || !file)
      throw new BadRequestException("Filepath and file is required");
    try {
      const config = {
        Key: filePath,
        Bucket: this.bucketName,
        Body: file,
      };

      const uploadCommand = new PutObjectCommand(config);
      await this.s3storage.send(uploadCommand);
      return filePath;
    } catch (e) {
      throw new BadRequestException("Could not upload file");
    }
  }

  async getImageByFileId(filePath: string) {
    if (!filePath) throw new BadRequestException("FilePath is required");
    const config = {
      Key: filePath,
      Bucket: this.bucketName,
    };

    const getCommand = new GetObjectCommand(config);
    const fileStream = await this.s3storage.send(getCommand);

    if (fileStream.Body instanceof Readable) {
      const chunks = [];
      for await (const chunk of fileStream.Body) {
        chunks.push(chunk);
      }

      const fileBuffer = Buffer.concat(chunks);
      const base64 = fileBuffer.toString("base64");
      const file = `data:${fileStream.ContentType};base64,${base64}`;

      return file;
    }
  }

  async deleteImageByFileId(filePath: string) {
    if (!filePath) throw new BadRequestException("File path is required");
    const config = {
      Key: filePath,
      Bucket: this.bucketName,
    };
    const deleteCommand = new DeleteObjectCommand(config);
    await this.s3storage.send(deleteCommand);

    return `deleted ${filePath}`;
  }
}
