import {CronJob, cronJob} from '@loopback/cron';
import {sendAt} from "cron";


@cronJob()
export class ScheduledGameChartsConsumer extends CronJob {
    constructor() {
        const now = new Date();
        now.setMilliseconds(now.getMilliseconds() + 10);
        super({
            name: 'job-B',
            onTick: () => {
                console.log(now)
            },
            cronTime: sendAt(now),
            start: false,
        });
    }
}

