import { DemoApplication } from '../../application';
import { Client, expect } from '@loopback/testlab';
import { setupApplication } from '../acceptance/test-helper';

describe('GameController', () => {
  let app: DemoApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /v1/ios/charts/game/paid', async () => {
    const res = await client.get('/v1/ios/charts/game/paid').expect(200);
    console.log(res.body);
   // expect(res.body).to.containEql({});
  });
});
