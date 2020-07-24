import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {createBindingFromClass} from '@loopback/context';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {GAME_FEED_SERVICE} from './bindings';
import {GamesFeedApi} from './service/GameFeedApi';
import {CronComponent} from '@loopback/cron';
import {ScheduledGameChartsConsumer} from './service/ScheduledGameChartsConsumer';

export {ApplicationConfig};

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
    // this.bind(SCHEDULED_DATABASE_REFRESHING).toClass(ScheduledGameChartsConsumer)
  }

  setupCronJob() {
    const jobBinding = createBindingFromClass(ScheduledGameChartsConsumer);
    this.add(jobBinding);
  }
}
