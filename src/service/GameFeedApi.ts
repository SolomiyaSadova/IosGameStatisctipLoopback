import axios, {AxiosInstance} from 'axios';
import {Game, GameType} from '../models';
import {GameRepository} from '../repositories';
import {repository} from '@loopback/repository';

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
  protected instance: AxiosInstance = axios.create({baseURL: ''});

  constructor(
    @repository(GameRepository)
    public gameRepository: GameRepository,
  ) {}

  async updateGamesFromUrl(url: String) {
    const response = await this.instance.get<GameResponse>(
      'https://rss.itunes.apple.com/api/v1/us/ios-apps/top-free/games/100/explicit.json',
    );

    const {status, data} = response;
    if (status === 200 && data && data.feed) {
      console.log(data.feed.results);
      const dtoGames: Array<GameResult> = data.feed.results;

      const games: Array<Game> = dtoGames.map(dtoGame =>
        Game.build(dtoGame, GameType.UNKNOWN),
      );
      // games.forEach(game => this.gameRepository.create(game))
      await this.gameRepository.createAll(games);
    } else {
      console.log(`No data returned. Response status - ${status}`);
    }
  }
}
