export default interface Settings {
  collectionLastReloads: CollectionLastReload[];
  theme: 'light' | 'dark' | 'auto' | undefined;
  articleSettings: ArticleSettings;
}

export interface CollectionLastReload {
  collectionId: string;
  lastReload?: number;
}

export interface ArticleSettings {
  fontSize?: number;
  brightness?: number;
  fontFamily?: 'serif' | 'sans-serif' | 'monospace';
  background?: 'default' | 'lightbrown' | 'lightgrey' | 'mediumgrey' | 'darkgrey';
}