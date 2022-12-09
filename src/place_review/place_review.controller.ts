import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceReviewService } from './place_review.service';
import { CreatePlaceReviewDto } from './dto/create.place_review.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from './../auth/Entity/user.entity';
import { AuthGuard } from './../auth/security/jwt.Guard';
import { PlaceService } from './../place/place.service';
import { Place } from './../place/Entity/place.entity';
import { AuthService } from 'src/auth/auth.service';
import { PlaceMoodService } from './../place_mood/place_mood.service';
import { TransactionInterceptor } from './../utils/transactionInterceptor';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionManager } from 'src/decorator/transaction.decorator';
import { EntityManager } from 'typeorm';

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
    const place = await this.checkPlace(createPlaceReviewDto.placeId);
    const user = await this.authService.getUserbyKakaoId(kakaoUser.userId);

    const newPlaceReview = await this.placeReviewService.createReview(
      createPlaceReviewDto,
      place[0],
      user[0],
      queryRunnerManager,
    );

    for (const mood of createPlaceReviewDto.placeMood) {
      await this.placeMoodService.createPlaceMood(
        newPlaceReview,
        place[0],
        mood,
        queryRunnerManager,
      );
    }

    return await this.placeReviewService.findByIndWithTransaction(
      newPlaceReview.id,
      queryRunnerManager,
    );
  }

  async checkPlace(placeId: string): Promise<Place[]> {
    return await this.placeService.findById(placeId);
  }
}
