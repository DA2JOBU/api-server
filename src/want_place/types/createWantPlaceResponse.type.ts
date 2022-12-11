import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WantPlaceResponse {
  @ApiProperty({
    example: '4fba2b7d-6aa4-4967-9367-46a30cbdc919',
    description: 'WantPlace ID',
    type: String,
  })
  @IsString()
  id: string;
}
