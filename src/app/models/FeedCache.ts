import Stream from "./Stream";

export default interface FeedCache {
  feedId: string;
  fetchedAt: number;
  content?: Stream;
}