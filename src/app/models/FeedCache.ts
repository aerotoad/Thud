export default interface FeedCache {
  feedId: string;
  fetchedAt: number;
  content?: any;
}