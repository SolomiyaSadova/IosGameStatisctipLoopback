import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import {
  CACHE_GAMES_SERVICE,
  CACHE_SERVICE, GAMES_FACADE,
  GAME_SERVICE_API,
  LOGGER_BINDING,
} from './bindings';
import { CronComponent } from '@loopback/cron';
import { logger } from './logger-config';
import { GameServiceClientApi } from './service/game-service-client-api';
import { CacheObjectsService } from './service/cache-objects.service';
import { CacheGamesService } from './service/cache-games.service';
import { GamesFacade } from './service/games.facade';
import { ScheduledGameChartsConsumerService } from './service/scheduled-game-charts-consumer.service';
export { ApplicationConfig };
import { createBindingFromClass } from '@loopback/context';

export class DemoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.component(CronComponent);

    this.setupCronJob();

    this.setupServices();

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
    this.bind(LOGGER_BINDING).to(logger);
    this.bind(GAME_SERVICE_API).toClass(GameServiceClientApi);
    this.bind(CACHE_SERVICE).toClass(CacheObjectsService);
    this.bind(CACHE_GAMES_SERVICE).toClass(CacheGamesService);
    this.bind(GAMES_FACADE).toClass(GamesFacade);
  }

  setupCronJob() {
    const jobBinding = createBindingFromClass(ScheduledGameChartsConsumerService);
    this.add(jobBinding);
  }
}



