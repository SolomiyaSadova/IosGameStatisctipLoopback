export interface GameFeed {
  results: GameResult[];
}
export interface GameResponse {
  feed: GameFeed;
}
export interface GameResult {
  name: String;
  artistName: String;
  releaseDate: String;
  url: String;
}
