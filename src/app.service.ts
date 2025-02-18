import { Injectable } from "@nestjs/common";
import { AwsS3Service } from "./aws-s3/aws-s3.service";

@Injectable()
export class AppService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  getHello(): string {
    return "Hello World!";
  }

  uploadFile(filePath: string, file: Buffer) {
    return this.awsS3Service.uploadImage(filePath, file);
  }

  getFile(filePath: string) {
    return this.awsS3Service.getImageByFileId(filePath);
  }

  deleteFile(filePath: string) {
    return this.awsS3Service.deleteImageByFileId(filePath);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadedFiles = [];
    for (const file of files) {
      const path = Math.random().toString().slice(2);
      const filePath = `images/${path}`;
      const uploadedFile = await this.awsS3Service.uploadImage(
        filePath,
        file.buffer
      );
      uploadedFiles.push(uploadedFile);
    }

    const downloadableImages = await Promise.all(
      uploadedFiles.map((filePath) =>
        this.awsS3Service.getImageByFileId(filePath)
      )
    );

    return downloadableImages;
  }

  async getFiles(filePaths: string[]) {
    const retrievedFiles = await Promise.all(
      filePaths.map((filePath) => this.awsS3Service.getImageByFileId(filePath))
    );
    return retrievedFiles;
  }

  async deleteFiles(filePaths: string[]) {
    const deletedFiles = await Promise.all(
      filePaths.map((filePath) =>
        this.awsS3Service.deleteImageByFileId(filePath)
      )
    );
    return deletedFiles;
  }
}
