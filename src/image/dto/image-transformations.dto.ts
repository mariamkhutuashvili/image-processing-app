import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class ResizeDto {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

class cropDto {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

class FilterDto {
  @IsBoolean()
  @IsOptional()
  greyscale?: boolean;

  @IsBoolean()
  @IsOptional()
  sepia?: boolean;
}

export class WatermarkDto {
  @IsString()
  @IsOptional()
  watermarkPath?: string;

  @IsNumber()
  watermarkWidth:number;

  @IsNumber()
  watermartHeight:number;

  @IsEnum(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'])
  @IsOptional()
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'; 

  @IsNumber()
  @IsOptional()
  top?: number;

  @IsNumber()
  @IsOptional()
  left?: number;
}

export class TransformationsDto {
  @IsObject()
  @IsOptional()
  resize?: ResizeDto;

  @IsObject()
  @IsOptional()
  crop?: cropDto;

  @IsNumber()
  @IsOptional()
  rotate?: number;

  @IsString()
  @IsOptional()
  @IsIn(['jpeg', 'png', 'webp'])
  format?: 'jpeg' | 'png' | 'webp';

  @IsObject()
  @IsOptional()
  filter?: FilterDto;

  @IsBoolean()
  @IsOptional()
  flip?:boolean;

  @IsBoolean()
  @IsOptional()
  mirror?:boolean;

  @IsNumber()
  @IsOptional()
  compress?: number;

  @IsObject()
  @IsOptional()
  watermark?: WatermarkDto;
}

export class TransformImageRequestDto {
  @IsObject()
  transformations: TransformationsDto;
}
