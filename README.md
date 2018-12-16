# Open Weather Map Weather Search

A barebones weather display showing showing current weather and a summarized 5-day forecast. This project consists of a React based frontend client only interfacing with the Open Weather Map API. 

## Running the Client
```bash
# Start the server (default port 3000)
cd client
npm install
npm run start
```
### Environment Variables
The `server` uses [dotenv](https://github.com/motdotla/dotenv) for loading environment variables. The following environment variables are supported:

| Name | Description | Default |
|------|-------------|---------|
| REACT_APP_API_KEY | API key used for authenticating to the Open Weather Map API | N/ A |
| PORT | Port on which the Express server will listen | 3000 |


