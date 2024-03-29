export default interface Settings {
  collectionLastReloads: CollectionLastReload[];
  theme: 'light' | 'dark' | 'auto' | undefined;
  articleSettings: ArticleSettings;
  cacheTimeout: number;
  introVersion?: number;
}

export interface CollectionLastReload {
  collectionId: string;
  lastReload?: number;
}

export interface ArticleSettings {
  fontSize?: number;
  brightness?: number;
  fontFamily?: 'serif' | 'sans' | 'mono';
  background?: 'default' | 'lightbrown' | 'lightgrey' | 'mediumgrey' | 'darkgrey';
  useSystemBrowser?: boolean;
}