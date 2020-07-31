import { Entity, model, property } from '@loopback/repository';
import { GameResult } from '../service/types';

export enum GameType {
  FREE ='FREE',
  PAID = 'PAID',
  GROSSING = 'GROSSING',
  UNKNOWN = 'UNKNOWN',
}

@model()
export class Game extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: String;

  @property({
    type: 'string',
    required: true,
  })
  artistName: String;

  @property({
    type: 'string',
    required: true,
  })
  url: String;

  @property({
    type: 'date',
    required: true,
  })
  releaseDate: String;

  @property({
    type: 'date',
    required: true,
    default: '$now',
  })
  createdDate: String;

  @property({
    type: 'object',
    required: true,
    enum: Object.values(GameType),
    default: GameType.UNKNOWN,
  })
  gameType: GameType;

  constructor(data?: Partial<Game>) {
    super(data);
  }

  static build(gameResult: GameResult, gameType: GameType): Game {
    const game = new Game();
    game.name = gameResult.name;
    game.releaseDate = gameResult.releaseDate;
    game.artistName = gameResult.artistName;
    game.url = gameResult.url;
    game.gameType = gameType;

    return game;
  }
}

export interface GameRelations {
  // describe navigational properties here
}

export type GameWithRelations = Game & GameRelations;
