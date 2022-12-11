import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/security/jwt.Guard';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../auth/Entity/user.entity';
import { AuthService } from '../auth/auth.service';
import { PlaceService } from '../place/place.service';
import { WantPlaceService } from './want_place.service';
import { CreateWantPlace } from './dto/createWantPlace.dto';
import { GetUser } from '../decorator/get-user.decorator';
import { WantPlaceResponse } from './types/createWantPlaceResponse.type';
import { WantPlaceAndPlace } from './types/wantPlaceAndPlace.type';

@ApiTags('Want-place Api')
@Controller('want-place')
export class WantPlaceController {
  constructor(
    private readonly wantPlaceService: WantPlaceService,
    private readonly placeService: PlaceService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'createWantPlace', description: 'createWantPlace' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'CreateWantPlaceDto',
    required: true,
    type: CreateWantPlace,
  })
  @ApiResponse({
    status: 201,
    description: 'create want place id',
    type: WantPlaceResponse,
  })
  @UseGuards(AuthGuard)
  @Post()
  async createWantPlace(
    @Body() addWantPlace: CreateWantPlace,
    @GetUser() getUser: User,
  ) {
    const place = await this.placeService.findById(addWantPlace.placeId);
    const userData = await this.authService.getUserbyKakaoId(getUser.userId);

    const wantPlace = await this.wantPlaceService.createWantPlace(
      place,
      userData[0],
    );

    return {
      id: wantPlace.id,
    };
  }

  @ApiOperation({ summary: 'getMyWantPlace', description: 'getMyWantPlace' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiResponse({
    status: 200,
    description: 'placeReviewAndPlace',
    type: [WantPlaceAndPlace],
  })
  @UseGuards(AuthGuard)
  @Get('my/list')
  async getMyWantPlace(@GetUser() getUser: User) {
    const user = await this.authService.getUserbyKakaoId(getUser.userId);

    const wantPlaces = await this.wantPlaceService.getWantPlacesByUserId(
      user[0].id,
    );

    return wantPlaces;
  }
}
