import axios, { AxiosInstance } from 'axios';
import { Game, GameType } from '../models';
import { GameRepository } from '../repositories';
import { repository } from '@loopback/repository';

interface GameFeed {
  results: GameResult[];
}

interface GameResponse {
  feed: GameFeed;
}

export interface GameResult {
  name: String;
  artistName: String;
  releaseDate: String;
  url: String;
}

export class GamesFeedApi {
  protected instance: AxiosInstance = axios.create({ baseURL: '' });

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @repository(GameRepository)
    public gameRepository: GameRepository,
  ) {
  }

  async updateGamesFromUrl(url: string) {
    const response = await this.instance.get<GameResponse>(url);

    const { status, data } = response;
    if (status === 200 && data && data.feed) {

      const dtoGames: Array<GameResult> = data.feed.results;
      const gameType = this.getGameTypeFromUrl(url);
      const games: Array<Game> = dtoGames.map((dtoGame) => {
          return Game.build(dtoGame, gameType);
        },
      );

      await this.gameRepository.createAll(games);
    } else {
      console.log(`No data returned. Response status - ${status}`);
    }
  }

  // getGameTypeFromUrl(url: String): GameType | undefined {
  //   const lastPartOfUrl = url.split('top-').pop();
  //   if (lastPartOfUrl) {
  //     const type = lastPartOfUrl.split('/');
  //     const gameType = type[0].toUpperCase();
  //     if (gameType in GameType) {
  //       return gameType as GameType;
  //     } else {
  //       throw new HttpErrors.UnprocessableEntity('Invalid enum value');
  //       return GameType.UNKNOWN;
  //     }
  //   }
  // }

  getGameTypeFromUrl(url: String): GameType {
    const lastPartOfUrl = url.split('top-').pop();
    if (lastPartOfUrl) {
      const type = lastPartOfUrl.split('/');
      const gameType = type[0].toUpperCase();
      switch (gameType) {
        case 'FREE':
          return GameType.FREE;
        case 'PAID':
          return GameType.PAID;
        case 'GROSSING':
          return GameType.GROSSING;
        default:
          return GameType.UNKNOWN;
      }
    } else {
      return GameType.UNKNOWN;
    }
  }
}
