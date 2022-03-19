import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import FeedCache from '../../models/FeedCache';
import * as moment from 'moment';
import Collection from 'src/app/models/Collection';
import Settings from 'src/app/models/Settings';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  initialize(): Promise<any> {
    return new Promise(async (resolve) => {
      console.log('Initializing storage...');
      const settings = await Storage.get({ key: 'settings' });
      if (!settings.value) await Storage.set({ key: 'settings', value: JSON.stringify({
        theme: 'light',
        cacheTimeout: 3600,
        collectionLastReloads: [],
      }) });

      const collections = await Storage.get({ key: 'collections' });
      if (!collections.value) await Storage.set({ key: 'collections', value: JSON.stringify([]) });
      
      const cache = await Storage.get({ key: 'cache' });
      if (!cache.value) await Storage.set({ key: 'cache', value: JSON.stringify([]) });

      const readEntries = await Storage.get({ key: 'readEntries' });
      if (!readEntries.value) await Storage.set({ key: 'readEntries', value: JSON.stringify([]) });

      resolve(true);
    });
  }

  getSettings(): Promise<Settings> {
    return new Promise(async (resolve) => {
      const settings = await Storage.get({ key: 'settings' });
      resolve(JSON.parse(settings.value));
    });
  }

  setSettings(settings: Settings): Promise<Settings> {
    return new Promise(async (resolve) => {
      await Storage.set({ key: 'settings', value: JSON.stringify(settings) });
      resolve(settings);
    });
  }

  getCollections(): Promise<Collection[]> {
    return new Promise(async (resolve) => {
      const collections = await Storage.get({ key: 'collections' });
      resolve(JSON.parse(collections.value));
    });
  }

  getCollectionByFeedId(feedId: string): Promise<Collection> {
    return new Promise(async (resolve) => {
      const collections = await this.getCollections();
      const collection: Collection = collections.find(collection => collection.feedList.some(feedIdItem => feedIdItem.feedId === feedId));
      resolve(collection);
    });
  }

  setCollections(collections: Collection[]): Promise<Collection[]> {
    return new Promise(async (resolve) => {
      await Storage.set({ key: 'collections', value: JSON.stringify(collections) });
      resolve(collections);
    });
  }

  addCollection(collection: Collection): Promise<Collection> {
    return new Promise(async (resolve) => {
      const collections = await this.getCollections();
      collections.push(collection);
      await this.setCollections(collections);
      resolve(collection);
    });
  }

  updateCollection(collection: Collection): Promise<Collection> {
    return new Promise(async (resolve) => {
      const collections = await this.getCollections();
      const index = collections.findIndex(item => item.id === collection.id);
      collections[index] = collection;
      await this.setCollections(collections);
      resolve(collection);
    });
  }

  deleteCollection(collection: Collection): Promise<Collection> {
    return new Promise(async (resolve) => {
      const collections = await this.getCollections();
      const index = collections.findIndex(item => item.id === collection.id);
      collections.splice(index, 1);
      await this.setCollections(collections);
      resolve(collection);
    });
  }

  getAllFeedIds(): Promise<string[]> {
    return new Promise(async (resolve) => {
      const collections = await this.getCollections();
      const feedIds: string[] = [];
      collections.forEach(collection => {
        collection.feedList.forEach((collectionFeed) => {
          if (!feedIds.includes(collectionFeed.feedId)) feedIds.push(collectionFeed.feedId)
        });
      });
      resolve(feedIds);
    });
  }

  getCacheByFeedId(feedId: string): Promise<FeedCache> {
    return new Promise(async (resolve) => {
      const cache = await Storage.get({ key: 'cache' });
      const cacheList: FeedCache[] = JSON.parse(cache.value);
      const cacheItem: FeedCache = cacheList.find(item => item.feedId === feedId);
      resolve(cacheItem);
    });
  }

  setCacheByFeedId(feedId: string, content: any): Promise<FeedCache> {
    return new Promise(async (resolve) => {
      const cache = await Storage.get({ key: 'cache' });
      const cacheList: FeedCache[] = JSON.parse(cache.value);
      const cacheItem: FeedCache = cacheList.find(item => item.feedId === feedId);
      if (cacheItem) {
        cacheItem.content = content;
        cacheItem.fetchedAt = moment().unix();
      } else {
        cacheList.push({ feedId, fetchedAt: moment().unix(), content });
      }
      await Storage.set({ key: 'cache', value: JSON.stringify(cacheList) });
      resolve(cacheItem);
    });
  }

  deleteCacheByFeedId(feedId: string): Promise<FeedCache> {
    return new Promise(async (resolve) => {
      const cache = await Storage.get({ key: 'cache' });
      const cacheList: FeedCache[] = JSON.parse(cache.value);
      const cacheItem: FeedCache = cacheList.find(item => item.feedId === feedId);
      if (cacheItem) {
        cacheList.splice(cacheList.indexOf(cacheItem), 1);
        await Storage.set({ key: 'cache', value: JSON.stringify(cacheList) });
      }
      resolve(cacheItem);
    });
  }

  deleteCache(): Promise<boolean> {
    return new Promise(async (resolve) => {
      await Storage.set({ key: 'cache', value: JSON.stringify([]) });
      resolve(true);
    });
  }

  getReadEntries(): Promise<string[]> {
    return new Promise(async (resolve) => {
      const readEntries = await Storage.get({ key: 'readEntries' });
      resolve(JSON.parse(readEntries.value));
    });
  }

  setReadEntries(readEntries: string[]): Promise<string[]> {
    return new Promise(async (resolve) => {
      await Storage.set({ key: 'readEntries', value: JSON.stringify(readEntries) });
      resolve(readEntries);
    });
  }

  addReadEntry(entryId: string): Promise<string[]> {
    return new Promise(async (resolve) => {
      const readEntries = await this.getReadEntries();
      if (!readEntries.includes(entryId)) {
        // Add entry
        readEntries.push(entryId);
        // If readEntries is more than 100, remove the oldest entry
        if (readEntries.length > 100) readEntries.shift();
        await this.setReadEntries(readEntries);
      }
      resolve(readEntries);
    });
  }

}
