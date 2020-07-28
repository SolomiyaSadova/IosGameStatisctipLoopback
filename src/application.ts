import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { createBindingFromClass } from '@loopback/context';
import {LoggingComponent} from '@loopback/extension-logging';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { GAME_FEED_SERVICE } from './bindings';
import { GamesFeedApi } from './service/game-feed-api.service';
import { CronComponent } from '@loopback/cron';
import { ScheduledGameChartsConsumerService } from './service/scheduled-game-charts-consumer.service';

export { ApplicationConfig };

export class DemoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.component(CronComponent);

    this.setupServices();

    this.setupCronJob();

    this.component(LoggingComponent);
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
    // this.bind(SCHEDULED_DATABASE_REFRESHING).toClass(ScheduledGameChartsConsumerService)
  }

  setupCronJob() {
    const jobBinding = createBindingFromClass(ScheduledGameChartsConsumerService);
    this.add(jobBinding);
  }
}
