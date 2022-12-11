import { ApiProperty } from '@nestjs/swagger';
import { PlaceMood } from 'src/place_mood/Entity/place_mood.entity';
import { PlaceReview } from 'src/place_review/Entity/place_review.entity';
import { WantPlace } from 'src/want_place/Entity/want_place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlaceInfo } from './placeInfo.entity';

@Entity()
export class Place {
  @ApiProperty({
    example: '1d6996ed-cd26-4387-ae89-6acc6912aa66',
    description: 'id',
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToMany(() => PlaceReview, (placeReviw) => placeReviw.place, {
    eager: false,
    cascade: true,
  })
  place_review: PlaceReview[];

  @OneToMany(() => PlaceMood, (placeMood) => placeMood.place, {
    eager: false,
    cascade: true,
  })
  place_mood: PlaceMood[];

  @ApiProperty({
    description: '장소 상세정보',
  })
  @OneToOne(() => PlaceInfo, (placeInfo) => placeInfo.place, {
    eager: false,
    cascade: ['insert'],
  })
  @JoinColumn()
  place_Info: PlaceInfo;

  @OneToOne(() => WantPlace, (wantPlace) => wantPlace.place, {
    eager: false,
  })
  @JoinColumn()
  want_place: WantPlace;

  @ApiProperty({
    example: '234127678',
    description: '카카오 장소 id',
  })
  @Column({ name: 'kakao_id' })
  kakaoId: string; // 카카오 측 id

  @ApiProperty({
    example: '키친마이야르',
    description: '장소 이름',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: '양식',
    description: '카테고리',
  })
  @Column()
  category: string;

  @ApiProperty({
    example: '127.035423195622',
    description: '경도',
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  x: number;

  @ApiProperty({
    example: '37.5266092359544',
    description: '위도',
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  y: number;

  @ApiProperty({
    example: '0',
    description: '리뷰 수',
  })
  @Column({ name: 'review_cnt', default: 0 })
  reviewCnt: number;

  @ApiProperty({
    example: '0',
    description: '리뷰평점',
  })
  @Column({ name: 'rating_avrg', default: 0, type: 'float' })
  ratingAvrg: number;

  @ApiProperty({
    description: '등록일',
    type: Date,
  })
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
