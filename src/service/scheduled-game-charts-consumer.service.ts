import { CronJob, cronJob } from '@loopback/cron';
import { GamesFeedApi } from './game-feed-api.service';
import { inject } from '@loopback/context';
import { GAME_FEED_SERVICE } from '../bindings';
import { logger } from '../logger-config';
import * as config from '../config/config.json';

@cronJob()
export class ScheduledGameChartsConsumerService extends CronJob {

  constructor(
    @inject(GAME_FEED_SERVICE)
      gamesFeedApi: GamesFeedApi,
  ) {

    const urls = [config.FETCH_URLS.GROSSING,
      config.FETCH_URLS.FREE,
      config.FETCH_URLS.PAID];

    const date = new Date().toLocaleString();
    super(
      {
        name: 'job-B',
        onTick: () => {
          logger.info(`Updating game charts in database...  Date: - ${date}`);
          for (const url of urls) {
            gamesFeedApi
              .updateGamesFromUrl(url)
              .then(res => logger.info(`Refreshing database was successfully. Url - ${url}.`))
              .catch(ex => logger.error(`Can not save games in database ${ex}`));
          }
        },
        cronTime: '0 * * * *', //every hour
        start: true,
      });

  }


}


