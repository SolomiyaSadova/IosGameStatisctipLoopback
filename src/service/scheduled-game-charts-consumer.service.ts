import { CronJob, cronJob } from '@loopback/cron';
import { GamesFeedApi } from './game-feed-api.service';
import { inject } from '@loopback/context';
import { GAME_FEED_SERVICE } from '../bindings';
import { LoggingBindings } from '@loopback/extension-logging';

@cronJob()
export class ScheduledGameChartsConsumerService extends CronJob {

  // const urls: Array<string> = ['https://rss.itunes.apple.com/api/v1/us/ios-apps/top-free/games/100/explicit.json',
  //   'https://rss.itunes.apple.com/api/v1/us/ios-apps/top-paid/games/100/explicit.json',
  //   'https://rss.itunes.apple.com/api/v1/us/ios-apps/top-grossing/games/100/explicit.json'];

  constructor(
    @inject(GAME_FEED_SERVICE)
      gamesFeedApi: GamesFeedApi,

  ) {

    super(
      {
        name: 'job-B',
        onTick: () => {
          // for(const url of urls) {
          gamesFeedApi
            .updateGamesFromUrl('https://rss.itunes.apple.com/api/v1/us/ios-apps/top-free/games/100/explicit.json')
            .catch(ex => console.log('Can not save games in database ${ex}'));
          //  }
        },
        cronTime: '*/20 * * * * *',
        start: true,
      });

  }


}
