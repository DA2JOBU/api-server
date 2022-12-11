import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WantPlace } from './Entity/want_place.entity';
import { WantPlaceController } from './want_place.controller';
import { WantPlaceService } from './want_place.service';
import { PlaceModule } from './../place/place.module';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WantPlace]), PlaceModule, AuthModule],
  exports: [WantPlaceService],
  controllers: [WantPlaceController],
  providers: [WantPlaceService],
})
export class WantPlaceModule {}
