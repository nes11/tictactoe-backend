With this project, I researched and had a go at RESTfulness. I also refined my understanding of testing, and kept the single responsibility principle in mind throughout the process. 

This repo goes together with the tictactoe-frontend repo for the UI. 

I started with create-react-app to make a basic UI in the form of a clickable board, then build a RESTful api to handle the requests from the frontend and tested it with Mocha and Chai. I incrementally added more functionality, and improved the UI and data structure. I’ve also used this project to learn about error handling.  

Edit to add: this app now runs in a three-container cluster with Docker. Clone this repo along with the tictactoe-frontend one. 

## Installation 
Install and start the backend and frontend servers.  

To install, build, and start the servers
```javascript
docker-compose up 
```

To test  
```javascript
npm test 
```