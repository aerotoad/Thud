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
      const encodedQuery = encodeURIComponent(query);
      const response = await Http.get({
        url: `${this.BASE_URL}/v3/search/feeds?query=${encodedQuery}&count=${count}&locale=${locale}`,
      });
      if (response.status !== 200) {
        reject(response.data);
      }
      resolve(response.data);
    });
  }

  getFeedStream(feedId: string, count: number = 15): Promise<Stream> {
    return new Promise(async (resolve, reject) => {
      const encodedId = encodeURIComponent(feedId);
      const response = await Http.get({
        url: `${this.BASE_URL}/v3/streams/contents?streamId=${encodedId}&count=${count}`,
      });
      if (response.status !== 200) {
        reject(response.data);
      }
      resolve(response.data);
    });
  }

  getEntry(entryId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const encodedId = encodeURIComponent(entryId);
      const response = await Http.get({
        url: `${this.BASE_URL}/v3/entries/${encodedId}`,
      });
      if (response.status !== 200) {
        reject(response.data);
      }
      resolve(response.data);
    });
  }

}
