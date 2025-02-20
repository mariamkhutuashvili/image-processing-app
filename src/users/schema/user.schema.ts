import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: String, select: false })
  otpCode: string;

  @Prop({ type: Date, select: false })
  validateOtpCodeDate: Date;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: [mongoose.Types.ObjectId], ref: "Image", default: [] })
  images: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
