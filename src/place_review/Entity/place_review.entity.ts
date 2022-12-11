import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/Entity/user.entity';
import { Place } from 'src/place/Entity/place.entity';
import { PlaceMood } from 'src/place_mood/Entity/place_mood.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlaceReview {
  @ApiProperty({
    required: false,
    type: String,
  })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({
    required: false,
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.place_Reviews, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ApiProperty({
    required: false,
    type: () => PlaceMood,
    isArray: true,
  })
  @OneToMany(() => PlaceMood, (placeMood) => placeMood.place_review, {
    cascade: true,
    eager: false,
  })
  place_mood: PlaceMood[];

  @ApiProperty({
    required: false,
    type: () => Place,
  })
  @ManyToOne(() => Place, (place) => place.place_review, {
    onDelete: 'CASCADE',
    eager: false,
  })
  place: Place;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Column()
  participants: number; // 변경 필요 인원 수

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Column()
  rating: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @Column()
  price_range: string;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_cork_charge: boolean; // 콜키지

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_room: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Column()
  is_reservation: boolean;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
