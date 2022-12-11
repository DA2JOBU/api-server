import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWantPlace {
  @ApiProperty({
    example: '1d6996ed-cd26-4387-ae89-6acc6912aa66',
    description: '장소 ID',
  })
  @IsNotEmpty()
  @IsString()
  placeId!: string;
}
