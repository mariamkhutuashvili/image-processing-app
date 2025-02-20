import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { AwsS3Module } from "src/aws-s3/aws-s3.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schema/user.schema";
import { ImageSchema } from "./schema/image.schema";
import { Image } from "./schema/image.schema";

@Module({
  imports: [
    AwsS3Module,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
