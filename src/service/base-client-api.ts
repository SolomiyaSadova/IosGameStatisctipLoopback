import axios, { AxiosInstance } from 'axios';
import { logger } from '../logger-config';

export class BaseClientApi {
  protected instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
  }

  protected async fetchArray<T>(requestString: string): Promise<T[]> {
    const response = await this.instance.get<T[]>(requestString);
    if (response.status === 200 && response.data) {
      logger.info(`Response - ${response.status}`);
      return response.data;
    } else {
      logger.error(`Error - ${response.status}.
          Url - ${requestString}`);
      throw new Error(response.statusText);
    }
  }
}