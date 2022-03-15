export default interface Stream {
  id: string; // the stream id, repeated.
  updated?: number; // the timestamp, in ms, of the most recent entry for this stream (regardless of continuation, newerThan, etc).
  continuation?: string; // the continuation id to pass to the next stream call, for pagination. This id guarantees that no entry will be duplicated in a stream (meaning, there is no need to de-duplicate entries returned by this call). If this value is not returned, it means the end of the stream has been reached.
  title?: string; // for single feeds only, the feed title.
  direction?: string; // for single feeds only, the text direction (“ltr” for left-to-right languages, “rtl” for right-to-left languages).
  alternate?: any; // link object for single feeds only, the feed website URL and type.
  items: Entry[]; // array See the entries API for a description of the fields.
}

export interface Entry {
  id: string; // the unique, immutable ID for this particular article.
  title?: string; // the article’s title. This string does not contain any HTML markup.
  content?: EntryContent; // object the article content. This object typically has two values: “content” for the content itself, and “direction” (“ltr” for left-to-right, “rtl” for right-to-left). The content itself contains sanitized HTML markup.
  summary?: EntryContent; // the article summary. See the content object above.
  author?: string; // the author’s name
  crawled?: number; // the immutable timestamp, in ms, when this article was processed by the feedly Cloud servers.
  recrawled?: number; // the timestamp, in ms, when this article was re-processed and updated by the feedly Cloud servers.
  published: number; // the timestamp, in ms, when this article was published, as reported by the RSS feed (often inaccurate).
  updated?: number; // the timestamp, in ms, when this article was updated, as reported by the RSS feed
  alternate?: any[]; // array a list of alternate links for this article. Each link object contains a media type and a URL. Typically, a single object is present, with a link to the original web page.
  origin?: EntryOrigin; // object the feed from which this article was crawled. If present, “streamId” will contain the feed id, “title” will contain the feed title, and “htmlUrl” will contain the feed’s website.
  keywords?: string[]; // array a list of keyword strings extracted from the RSS entry.
  visual?: EntryVisual; // object the visual representation of the article. If present, “url” will contain the image URL, “width” and “height” its dimension, and “contentType” its MIME type.
  unread: boolean; // whether this article is unread.
  tags?: any; // array a list of tag objects.
  categories?: Array<any>; // array a list of category objects.
  engagement?: number; // indicator of how popular this entry is. The higher the number, the more readers have read, saved or shared this particular entry. This value changes over time.
  engagementRate?: number; // normalized indicator for the relative popularity of this entry compared to past data from the same source. A value below 1.0 indicates this entry is less popular, on average. A value above 1.0 indicates this entry is more popular. Because this value is normalized, it can be used to compare entries from other sources, and is used for engagement ranking. This value changes over time.
  actionTimestamp?: number; // for tagged articles, contains the timestamp when the article was tagged by the user. This will only be returned when the entry is returned through the streams API.
  enclosure?: any; // object array a list of media links (videos, images, sound etc) provided by the feed. Some entries do not have a summary or content, only a collection of media links.
  fingerprint: string; // the article fingerprint. This value might change if the article is updated.
  originId: string; // the unique id of this post in the RSS feed (not necessarily a URL!)
  sid?: string; // an internal search id.
  priorities?: any; // priority object array a list of priority filters that match this entry (pro+ and team only).
  memes?: any; // meme object array a list of memes: clusters of entries from popular sources that are about the same subject. The meme id can be used to retrieve the other articles about the same subject.
  leoSummary?: any; // summary object For pro+ and enterprise sources, Feedly will extract one or two important sentences from the entry content, to be used for summary or highlights. The text does not include any HTML tags.
  commonTopics?: any // topic object array a list of detected topics in this article. This feature is only available for pro+ and enterprise feeds. Salience level can either be about (if the article is about this topic), or mention (if the article only mentions this topic)
  entities?: any[]; // array a list of detected entities in this article. This feature is only available for pro+ and enterprise feeds. mentions will list the text fragments that refer to each entity.
  related?: any[] // related entries object array a list of related or similar entries. This data is only available for pro+ and enterprise users, if similar=true is passed to the streams API.
  duplicates?: any[] // near-duplicate entries object array a list of near-duplicate entries. This data is only available for pro+ and enterprise users, if similar=true is passed to the streams API.
}

export interface EntryContent {
  // Object the article content. This object typically has two values: “content” for the content itself, and “direction” (“ltr” for left-to-right, “rtl” for right-to-left). The content itself contains sanitized HTML markup.
  content?: string;
  direction?: 'rtl' | 'ltr';
}

export interface EntryOrigin {
  // If present, “streamId” will contain the feed id, “title” will contain the feed title, and “htmlUrl” will contain the feed’s website.
  streamId: string;
  title: string;
  htmlUrl: string;
}

export interface EntryVisual {
  // If present, “url” will contain the image URL, “width” and “height” its dimension, and “contentType” its MIME type.
  url: string;
  width: number;
  height: number;
  contentType: string;
}