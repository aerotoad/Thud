export default interface Collection {
  id: string; // UUID
  name: string; // collection name
  description?: string; // Description is optional
  feedIds: string[]; // Array of feed ids
}