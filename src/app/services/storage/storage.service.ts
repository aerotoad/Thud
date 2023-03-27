import { Injectable } from '@angular/core';
import { Preferences as Storage } from '@capacitor/preferences';
import FeedCache from '../../models/FeedCache';
import * as moment from 'moment';
import Collection from 'src/app/models/Collection';
import Settings from 'src/app/models/Settings';
import Bookmark from 'src/app/models/Bookmark';
import { v4 as uuidv4 } from 'uuid';

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

      if (!collections.value) {
        const defaultCollection: Collection = {
          id: uuidv4(),
          name: 'Home',
          feedList: [],
          index: 0
        };
         await Storage.set({ key: 'collections', value: JSON.stringify([defaultCollection]) });
      }

      const readEntries = await Storage.get({ key: 'readEntries' });
      if (!readEntries.value) await Storage.set({ key: 'readEntries', value: JSON.stringify([]) });

      const bookmarks = await Storage.get({ key: 'bookmarks' });
      if (!bookmarks.value) await Storage.set({ key: 'bookmarks', value: JSON.stringify([]) });

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
      const feedCache = await Storage.get({ key: `cache_${feedId}` })
      resolve(JSON.parse(feedCache.value));
    });
  }

  setCacheByFeedId(feedId: string, content: any): Promise<FeedCache> {

    return new Promise(async (resolve) => {
      const cache = await Storage.get({ key: `cache_${feedId}` });
      let cacheItem: FeedCache = JSON.parse(cache.value);

      // If cache is empty, create new cache item
      if (!cacheItem) {
        cacheItem = {
          feedId,
          fetchedAt: moment().unix(),
          content
        };
      } else {
        // If cache is not empty, update cache item
        cacheItem.content = content;
        cacheItem.fetchedAt = moment().unix();
      }
      // Save cache item
      await Storage.set({ key: `cache_${feedId}`, value: JSON.stringify(cacheItem) });
      resolve(cacheItem);
    });
  }

  deleteCacheByFeedId(feedId: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      await Storage.remove({ key: `cache_${feedId}` });
      resolve(true);
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

  setBookmarks(bookmarks: Bookmark[]): Promise<Bookmark[]> {
    return new Promise(async (resolve) => {
      await Storage.set({ key: 'bookmarks', value: JSON.stringify(bookmarks) });
      resolve(bookmarks);
    });
  }

  getBookmarks(): Promise<Bookmark[]> {
    return new Promise(async (resolve) => {
      const bookmarks = await Storage.get({ key: 'bookmarks' });
      resolve(JSON.parse(bookmarks.value));
    });
  }

  addBookmark(bookmark: Bookmark): Promise<Bookmark> {
    return new Promise(async (resolve) => {
      const bookmarks = await this.getBookmarks();
      bookmarks.push(bookmark);
      // If bookmarks is more than 100, remove the oldest bookmark
      if (bookmarks.length > 100) bookmarks.shift();
      await this.setBookmarks(bookmarks);
      resolve(bookmark);
    });
  }

  deleteBookmark(bookmark: Bookmark): Promise<Bookmark> {
    return new Promise(async (resolve) => {
      const bookmarks = await this.getBookmarks();
      const index = bookmarks.findIndex(item => item.entryId === bookmark.entryId);
      bookmarks.splice(index, 1);
      await this.setBookmarks(bookmarks);
      resolve(bookmark);
    });
  }

  deleteBookmarkByEntryId(entryId: string): Promise<Bookmark> {
    return new Promise(async (resolve) => {
      const bookmarks = await this.getBookmarks();
      const index = bookmarks.findIndex(item => item.entryId === entryId);
      bookmarks.splice(index, 1);
      await this.setBookmarks(bookmarks);
      resolve(bookmarks[index]);
    });
  }

  bookmarkExists(entryId: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const bookmarks = await this.getBookmarks();
      resolve(bookmarks.findIndex(item => item.entryId === entryId) > -1);
    });
  }

}
