import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { createBindingFromClass } from '@loopback/context';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { FETCHING_GAMES_SERVICE, GAME_FEED_SERVICE, GAME_SERVICE_API, LOGGER_BINDING } from './bindings';
import { GamesFeedApi } from './service/game-feed-api.service';
import { CronComponent } from '@loopback/cron';
import { ScheduledGameChartsConsumerService } from './service/scheduled-game-charts-consumer.service';
import { logger } from './logger-config';
import * as config from './config/config.json';
import { FetchingGameService } from './service/fetching-game-service';
import { GameServiceClientApi } from './service/game-service-client-api';
export { ApplicationConfig };

export class DemoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    console.log(`CONFIG: ${ JSON.stringify(config) }`);
    // Set up the custom sequence
    this.sequence(MySequence);

    this.component(CronComponent);

    this.setupServices();

    this.setupCronJob();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupServices() {
    this.bind(GAME_FEED_SERVICE).toClass(GamesFeedApi);
    this.bind(LOGGER_BINDING).to(logger);
    this.bind(FETCHING_GAMES_SERVICE).toClass(FetchingGameService);
    this.bind(GAME_SERVICE_API).toClass(GameServiceClientApi);
  }

  setupCronJob() {
    const jobBinding = createBindingFromClass(ScheduledGameChartsConsumerService);
    this.add(jobBinding);
  }

}



