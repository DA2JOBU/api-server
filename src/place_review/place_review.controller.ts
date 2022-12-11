import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PlaceReviewService } from './place_review.service';
import { PlaceService } from './../place/place.service';
import { AuthService } from 'src/auth/auth.service';
import { PlaceMoodService } from './../place_mood/place_mood.service';
import { CreatePlaceReviewDto } from './dto/create.place_review.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from './../auth/Entity/user.entity';
import { PlaceReviewAndPlace } from './types/placeReviewAndPlace.type';
import { AuthGuard } from './../auth/security/jwt.Guard';
import { TransactionInterceptor } from './../utils/transactionInterceptor';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionManager } from 'src/decorator/transaction.decorator';

@ApiTags('Place-review Api')
@Controller('place-review')
export class PlaceReviewController {
  constructor(
    private readonly placeReviewService: PlaceReviewService,
    private readonly placeService: PlaceService,
    private readonly placeMoodService: PlaceMoodService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'createReview', description: 'createReview' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'CreatePlaceReviewDto',
    required: true,
    type: CreatePlaceReviewDto,
  })
  @ApiResponse({
    status: 201,
    description: 'placeReviewId',
    type: String,
  })
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(TransactionInterceptor)
  async createReview(
    @Body() createPlaceReviewDto: CreatePlaceReviewDto,
    @GetUser() kakaoUser: User,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    const place = await this.placeService.findById(
      createPlaceReviewDto.placeId,
    );
    const user = await this.authService.getUserbyKakaoId(kakaoUser.userId);

    const newPlaceReview = await this.placeReviewService.createReview(
      createPlaceReviewDto,
      place[0],
      user[0],
      queryRunnerManager,
    );
    const result = [];
    for (const mood of createPlaceReviewDto.placeMood) {
      const placeMoodResult = await this.placeMoodService.createPlaceMood(
        newPlaceReview,
        place[0],
        mood,
        queryRunnerManager,
      );
      result.push(placeMoodResult);
    }

    return result;
  }

  // @TODO 한페이지에 나오는 수량 페이징 적용
  @ApiOperation({
    summary: 'getMyPlaceReviews',
    description: 'getMyPlaceReviews',
  })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiResponse({
    status: 200,
    description: 'placeReviewAndPlace',
    type: [PlaceReviewAndPlace],
  })
  @UseGuards(AuthGuard)
  @Get('my/list')
  async getMyReview(@GetUser() getUser: User) {
    const user = await this.authService.getUserbyKakaoId(getUser.userId);

    const placeReviews = await this.placeReviewService.getPlaceReviewsByUserId(
      user[0].id,
    );

    return placeReviews;
  }
}
