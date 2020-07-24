import {Entity, model, property} from '@loopback/repository';
import {GameResult} from '../service/GameFeedApi';

export enum GameType {
  FREE,
  PAID,
  GROSSING,
  UNKNOWN,
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  artistName: string;

  @property({
    type: 'date',
    required: true,
  })
  releaseDate: string;

  @property({
    type: 'date',
    required: true,
    default: '$now',
  })
  createdDate: string;

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
    Object.assign(game, gameResult);
    game.gameType = gameType;

    return game;
  }
}

export interface GameRelations {
  // describe navigational properties here
}

export type GameWithRelations = Game & GameRelations;
