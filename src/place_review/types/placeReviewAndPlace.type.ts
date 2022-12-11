import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { Place } from '../../place/Entity/place.entity';

export class PlaceReviewAndPlace {
  @ApiProperty({
    description: 'PlaceReview ID',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'PlaceReview ID',
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'participants',
    type: Number,
  })
  @IsNumber()
  participants: number;

  @ApiProperty({
    description: 'rating',
    type: Number,
  })
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'price_range',
    type: String,
  })
  @IsString()
  price_range: string;

  @ApiProperty({
    description: 'is_cork_charge',
    type: Boolean,
  })
  @IsBoolean()
  is_cork_charge: boolean;

  @ApiProperty({
    description: 'is_room',
    type: Boolean,
  })
  @IsBoolean()
  is_room: boolean;

  @ApiProperty({
    description: 'is_reservation',
    type: Boolean,
  })
  @IsBoolean()
  is_reservation: boolean;

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
