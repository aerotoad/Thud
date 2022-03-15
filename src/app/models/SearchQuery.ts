export default interface SearchQuery {
  // Feedly api search query
  // https://developer.feedly.com/v3/search/
  hint: string; // an auto-completion guess of the keyword the user is trying to search for.
  related: Array<string>; // a list of other keywords the user might be interested in searching.
  results: Array<SearchResult>; // a list of results that match the query.
}

export interface SearchResult {
  // Feedly api search result
  feedId: string; // the unique, immutable id of this feed.
  subscribers: number; // number of Feedly Cloud subscribers who have this feed in their subscription list.
  title: string; // the feed name.
  description?: string; // the feed description.
  website?: string; // the website associated with this feed.
  lastUpdated?: number; // the timestamp, in ms, of the last article received for this feed
  velocity?: number; // the average number of articles published weekly. This number is updated every few days.
  language?: string; // this field is a combination of the language reported by the RSS feed, and the language automatically detected from the feed’s content. It might not be accurate, as many feeds misreport it.
  featured?: boolean; // if true, this feed is featured (recommended) for the topic or search query
  iconUrl?: string; // a small (square) icon URL.
  visualUrl?: string; // a larger (square) icon URL
  coverUrl?: string; // a large (rectangular) background image
  logo?: string; // url a small (square) icon URL with transparency
  contentType?: string // the auto-detected type of entries this feed publishes. Values include “article” (most common), “longform” (for longer article), “videos” (for YouTube, Vimeo and other video-centric feeds), and “audio” (for podcast feeds etc).
  coverColor?: string // hex color the background cover color
}