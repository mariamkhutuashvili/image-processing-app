import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { FilesInterceptor, FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("upload-image")
  @UseInterceptors(FileInterceptor("file"))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const path = Math.random().toString().slice(2);
    const filePath = `images/${path}`;
    return this.appService.uploadFile(filePath, file.buffer);
  }

  @Post("get-image")
  getImage(@Body("filePath") filePath: string) {
    return this.appService.getFile(filePath);
  }

  @Post("delete-image")
  deleteImage(@Body("filePath") filePath: string) {
    return this.appService.deleteFile(filePath);
  }

  @Post("upload-many")
  @UseInterceptors(FilesInterceptor("files"))
  uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    return this.appService.uploadFiles(files);
  }

  @Post("get-many")
  getMany(@Body("filePaths") filePaths: string[]) {
    return this.appService.getFiles(filePaths);
  }

  @Post("delete-many")
  deleteMany(@Body("filePaths") filePaths: string[]) {
    return this.appService.deleteFiles(filePaths);
  }
}
