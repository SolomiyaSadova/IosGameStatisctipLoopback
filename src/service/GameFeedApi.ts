// import axios, {AxiosInstance} from "axios";
// import {GameRepository} from "../repositories";
// import {Game, GameType} from "../models";
// import {fetch} from "node-fetch"
//
// interface GameResponse { results: Array<GameResult> }
// interface GameChartsResponse { feed: GameResponse}
// export class GameResult {
//     name: String
//     artistName: String
//     releaseDate: String
//     url: String
// }
//
// export class GamesFeedApi {
//     gameRepository: GameRepository
//     protected instance: AxiosInstance = axios.create({baseURL:
//             ""});
//     const urls = "https://www.reddit.com/r/popular.json";
//
//     let settings = { method: "Get" };
//
//     async updateGamesFromUrl(url: string) {
//
//
//         fetch(urls, settings)
//             .then(res => res.json())
//             .then((json) => {
//                 // do something with JSON
//             });
//         const feed: GameResponse = await this.instance.get<GameResponse>("https://rss.itunes.apple.com/api/v1/us/ios-apps")
//             .then(response => response.data);
//         const dtoGames =  feed.results;
//         const game = dtoGames.map(response => Game.build(response, GameType.UNKNOWN))
//         await this.gameRepository.createAll(game)
//     }
//
// }

import axios, {AxiosInstance} from 'axios';

interface GameFeed {
    results: GameResult[]
}

interface GameResponse {
    feed: GameFeed
}

export class GameResult {
    name: String
    artistName: String
    releaseDate: String
    url: String
}

export class GamesFeedApi {
    protected instance: AxiosInstance = axios.create({baseURL: ""});

    async updateGamesFromUrl(url: String) {
        const response = await this.instance
            .get<GameResponse>('https://rss.itunes.apple.com/api/v1/us/ios-apps/top-free/games/100/explicit.json');

        const { status, data } = response;
        if (status === 200 && data && data.feed) {
            console.log(data.feed.results);
        } else {
            console.log(`No data returned. Response status - ${status}`);
        }
    }
}