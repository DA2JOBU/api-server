import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Place } from '../../place/Entity/place.entity';

export class WantPlaceAndPlace {
  @ApiProperty({
    description: 'wantPlace ID',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'User ID',
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: '장소 정보',
    type: Place,
  })
  place: Place;
}
