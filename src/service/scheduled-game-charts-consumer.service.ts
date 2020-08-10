import { CronJob, cronJob } from '@loopback/cron';
import { inject } from '@loopback/context';
import { GAMES_FACADE } from '../bindings';
import { GamesFacade } from './games.facade';
import { logger } from '../logger-config';

@cronJob()
export class ScheduledGameChartsConsumerService extends CronJob {

  constructor(
    @inject(GAMES_FACADE)
    public gamesFacade: GamesFacade,
  ) {

    super(
      {
        name: 'job-B',
        onTick: () => {
          logger.info('Updating games in cache...');
          gamesFacade
            .cacheAllGames()
            .catch(ex => logger.info(`Can not save games in cache ${ex}`));
        },
        cronTime: '0 * * * *',
        start: true,
      });

  }


}