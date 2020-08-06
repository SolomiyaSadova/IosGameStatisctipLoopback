import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Game, GameRelations } from '../models';
import { MongoDatasource } from '../datasources';
import { inject } from '@loopback/core';

export class GameRepository extends DefaultCrudRepository<Game, typeof Game.prototype.id, GameRelations> {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(Game, dataSource);
  }

}

