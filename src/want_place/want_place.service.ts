import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/Entity/user.entity';
import { Place } from 'src/place/Entity/place.entity';
import { Repository } from 'typeorm';
import { WantPlace } from './Entity/want_place.entity';
import { generateUuid } from './../utils/gnerator';

@Injectable()
export class WantPlaceService {
  constructor(
    @InjectRepository(WantPlace)
    private readonly wantPlaceRepository: Repository<WantPlace>,
  ) {}

  async createWantPlace(place: Place, user: User): Promise<WantPlace> {
    const newWantPlace = new WantPlace();
    newWantPlace.id = generateUuid();
    newWantPlace.place = place;
    newWantPlace.user = user;

    const ret = await this.wantPlaceRepository.save(newWantPlace);

    return ret;
  }

  async getWantPlacesByUserId(userId: string): Promise<WantPlace[]> {
    const ret = await this.wantPlaceRepository.find({
      relations: {
        place: true,
      },
      where: {
        userId: userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return ret;
  }
}
