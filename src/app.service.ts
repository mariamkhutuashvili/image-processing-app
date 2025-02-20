import { Injectable } from "@nestjs/common";
import { AwsS3Service } from "./aws-s3/aws-s3.service";

@Injectable()
export class AppService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  getHello(): string {
    return "Hello World!";
  }
}
