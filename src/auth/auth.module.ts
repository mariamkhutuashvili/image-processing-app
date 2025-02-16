import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { EmailSenderModule } from "src/email-sender/email-sender.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schema/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECREt,
    }),
    UsersModule,
    EmailSenderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
