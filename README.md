# Satoshi's Palace Price Feed

## Developing

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine (latest LTS version recommended).

### Installation
```bash
npm install
```

### Environment Setup
Private Key:
```bash
cp .env.example .env
```

[**Set Your Private Key (Testing only link not secure)**](https://vanity-eth.tk/)

[**Set Coin Gecko API key**](https://www.coingecko.com/en/developers/dashboard?redirect=%2Freference%2Fcoins-id-market-chart)

### Run
```
npm start
```

### Docker build

```
npm install
docker login
docker build -t satoshispalace/price-oracle:latest .
docker push satoshispalace/price-oracle:latest
```