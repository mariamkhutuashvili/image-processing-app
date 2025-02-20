import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Image {
  @Prop({ type: String })
  uuid: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  path: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  uploadedBy: mongoose.Schema.Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
