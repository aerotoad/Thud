import Entry from "./Entry";

export default interface Stream {
  id: string; // the stream id, repeated.
  updated?: number; // the timestamp, in ms, of the most recent entry for this stream (regardless of continuation, newerThan, etc).
  continuation?: string; // the continuation id to pass to the next stream call, for pagination. This id guarantees that no entry will be duplicated in a stream (meaning, there is no need to de-duplicate entries returned by this call). If this value is not returned, it means the end of the stream has been reached.
  title?: string; // for single feeds only, the feed title.
  direction?: string; // for single feeds only, the text direction (“ltr” for left-to-right languages, “rtl” for right-to-left languages).
  alternate?: any; // link object for single feeds only, the feed website URL and type.
  items: Entry[]; // array See the entries API for a description of the fields.
}