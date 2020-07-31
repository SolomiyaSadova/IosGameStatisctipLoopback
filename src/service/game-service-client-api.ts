import { Game } from '../models';
import { BaseClientApi } from './base-client-api';
import * as config from '../config/config.json';

export class GameServiceClientApi extends BaseClientApi {

  constructor() {
    super(config.GAME_API_URL);
  }

  async getAllGames(limit: number): Promise<Game[]> {
    const requestString = `${config.GAME_API_URL}/?limit=${limit}`;
    return this.fetchArray<Game>(requestString);
  }

  async getGamesByType(gameType: string, limit: number): Promise<Game[]> {
    const requestString = `${config.GAME_API_URL}/${gameType}?limit=${limit}`;
    return this.fetchArray<Game>(requestString);
  }


}