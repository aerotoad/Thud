import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import SearchQuery from 'src/app/models/SearchQuery';
import Stream from 'src/app/models/Stream';

@Injectable({
  providedIn: 'root'
})
export class FeedlyService {

  private BASE_URL: string = 'https://cloud.feedly.com';

  constructor() { }

  search(query: string, count: number = 15, locale?: string): Promise<SearchQuery> {
    return new Promise(async (resolve, reject) => {
      const response = await Http.get({
        url: `${this.BASE_URL}/v3/search/feeds?query=${query}&count=${count}&locale=${locale}`,
      });
      if (response.status !== 200) {
        reject(response.data);
      }
      resolve(response.data);
    });
  }

  getFeedStream(feedId: string, count: number = 15): Promise<Stream> {
    return new Promise(async (resolve, reject) => {
      const response = await Http.get({
        url: `${this.BASE_URL}/v3/streams/contents?streamId=${feedId}&count=${count}`,
      });
      if (response.status !== 200) {
        reject(response.data);
      }
      resolve(response.data);
    });
  }

}
