export default interface Collection {
  id: string; // UUID
  name: string; // collection name
  description?: string; // Description is optional
  feedList: CollectionFeed[] // Array of feed ids with index
}

export interface CollectionFeed {
  feedId: string; // Feedly feed id
  index: number; // Index in feedList
}