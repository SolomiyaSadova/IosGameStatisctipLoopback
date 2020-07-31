import { repository } from '@loopback/repository';
import { GameRepository } from '../repositories';
import { Game, GameType } from '../models';

export class FetchingGameService {
  constructor(
    @repository(GameRepository)
    public gameRepository: GameRepository,
  ) {}

  getGamesByType(gameType: GameType, limit: number): Promise<Array<Game>> {
    return this.gameRepository.find({where: {gameType: gameType}, limit: limit });
  }

  getAllGames(): Promise<Array<Game>> {
    return this.gameRepository.find();
  }
}