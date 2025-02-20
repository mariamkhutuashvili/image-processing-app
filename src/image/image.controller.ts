import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  UploadedFiles,
  Param,
} from "@nestjs/common";
import { ImageService } from "./image.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/auth.guard";
import { TransformImageRequestDto } from "./dto/image-transformations.dto";

@Controller("image")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post(":id/transform")
  @UseGuards(AuthGuard)
  create(
    @Param("id") id: string,
    @Body() transformImageRequestDto: TransformImageRequestDto,
    @Req() req
  ) {
    const userId = req.user.userId;
    return this.imageService.processImage(id, userId, transformImageRequestDto);
  }

  @Post("upload-image")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async addImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.userId;
    return this.imageService.addImage(file, userId);
  }

  @Post("get-image")
  @UseGuards(AuthGuard)
  getImage(@Body("filePath") filePath: string, @Req() req) {
    const userId = req.user.userId;
    return this.imageService.getFile(filePath, userId);
  }

  @Post("delete-image")
  @UseGuards(AuthGuard)
  deleteImage(@Body("filePath") filePath: string, @Req() req) {
    const userId = req.user.userId;
    return this.imageService.deleteFile(filePath, userId);
  }

  @Post("upload-many")
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor("files"))
  uploadMany(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
    const userId = req.user.userId;
    return this.imageService.uploadFiles(files, userId);
  }

  @Post("get-many")
  @UseGuards(AuthGuard)
  getMany(@Body("filePaths") filePaths: string[], @Req() req) {
    const userId = req.user.userId;
    return this.imageService.getFiles(filePaths, userId);
  }

  @Post("delete-many")
  @UseGuards(AuthGuard)
  deleteMany(@Body("filePaths") filePaths: string[], @Req() req) {
    const userId = req.user.userId;
    return this.imageService.deleteFiles(filePaths, userId);
  }
}
