# IosGameStatistic

It is an application that use IosGameStatistic app (https://github.com/SolomiyaSadova/IosGameStatistic) to load games charts. Games charts store in MongoDB. Also, the app use a scheduler to refresh games charts in cache. 
There are 3 games types (paid, free and grossing), so you can set a type of games that you want to get. Also, you can set a number of games that you want to get.

## Built With

- Node.js
- TypeScript
- Mongo
- Loopback
- Node Package Manager

## Run

### Locally
``
npm install
``

``
npm run
``

### Build

``
npm run-script build
``

### Run with Docker

``
docker build .
``

``
docker-compose up
``



