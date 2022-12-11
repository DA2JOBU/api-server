import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { User } from './Entity/user.entity';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt/dist';
import { GetUserDto } from './dto/getUser.dto';
import { LoginRequest } from './dto/loginRequest.dto';
import { NotAcceptableException } from '@nestjs/common/exceptions';
import { KakaoAuth } from './auth.types';
import authConst from './auth.const';
import { generateUuid } from './../utils/gnerator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async login(data: LoginRequest) {
    let user: User;
    switch (data.vendor) {
      case 'kakao': {
        user = await this.getUserByKakaoAccessToken(data);
        break;
      }
      default: {
        throw new NotAcceptableException();
      }
    }

    const { accessToken, accessOption } = await this.getJwtAcessToken(
      user.userId,
      user.nickname,
    );

    const { refreshToken, refreshOption } = await this.getRefreshToekn(
      user.userId,
      user.nickname,
    );

    await this.updateRefreshToken(refreshToken, user.userId);

    return {
      userId: user.userId,
      nickname: user.nickname,
      accessToken,
      accessOption,
      refreshToken,
      refreshOption,
    };
  }

  async getUserByKakaoAccessToken(data: LoginRequest): Promise<User> {
    const { accessToken } = data;
    const url = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      Authorization: `bearer ${accessToken}`,
    };
    const auth = await this.httpService.axiosRef
      .get(url, { headers })
      .catch(() => {
        throw new UnauthorizedException('Kakao OAuth Exception.');
      });
    if (!auth) throw new UnauthorizedException('Kakao OAuth Exception.');
    const kakaoAuth: KakaoAuth = auth.data;

    const user = await this.userRepository.findOne({
      where: { userId: kakaoAuth.id },
    });

    if (!user) {
      return await this.createKakaoUser(kakaoAuth);
    }

    return user;
  }

  async createKakaoUser(kakaoAuth: KakaoAuth): Promise<User> {
    const data = this.userRepository.create({
      id: generateUuid(),
      userId: kakaoAuth.id,
      nickname: this.createDefaultNickname(),
      vendor: authConst.VENDOR.KAKAO,
      email: kakaoAuth.kakao_account.email,
      image: kakaoAuth.kakao_account.profile.profile_image_url,
      gender: kakaoAuth.kakao_account.gender,
      ageRange: kakaoAuth.kakao_account.age_range,
    });
    return await this.userRepository.save(data);
  }

  createDefaultNickname(): string {
    const dateFormat = dayjs().format('YYYYMMDDHHmm');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${dateFormat}${random}`;
  }

  async getJwtAcessToken(userId: number, nickname: string) {
    const payload = { userId, nickname };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'test',
      expiresIn: process.env.AUTH_EXPPIRESIN || '10m',
    });
    return {
      accessToken,
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 10,
      },
    };
  }
  async getRefreshToekn(userId: number, nickname: string) {
    const payload = { userId, nickname };
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      expiresIn: process.env.REFRESH_EXPPIRESIN || '1d',
    });
    return {
      refreshToken,
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    };
  }

  async updateRefreshToken(refreshToken: string, userId: number) {
    await this.userRepository.update({ userId }, { refreshToken });
  }

  logout() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  async removeRefreshToken(getUserDto: GetUserDto) {
    const user = await this.userRepository.findOne({
      where: { nickname: getUserDto.nickname, userId: getUserDto.userId },
    });
    user.refreshToken = null;
    await this.userRepository.save(user);
  }

  async getUserRefreshTokenMatches(
    refreshToken: string,
    getUserDto: GetUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { nickname: getUserDto.nickname, userId: getUserDto.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Can not find user');
    }
    const isRefreshTokenMatch = refreshToken === user.refreshToken;

    if (isRefreshTokenMatch) {
      return { result: true };
    } else {
      throw new UnauthorizedException();
    }
  }

  async getUserbyKakaoId(kakaoId: number): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        userId: kakaoId,
      },
    });
  }

  async getUserPlaceReviews(id: string): Promise<any> {
    return await this.userRepository.find({
      relations: {
        place_Reviews: true,
      },
      where: {
        id: id,
      },
    });
  }
}
