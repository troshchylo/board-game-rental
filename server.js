const express = require('express');
const log = (message) => console.log(message);
const app = express();
const port = 3000;
let db = require("./db.json");
const fs = require('node:fs');

app.use(express.static('public'));
app.use(express.json());

app.get('/get-offers', (req, res) => {
  res.send(JSON.stringify(getOfferList()));
});

app.get('/game_info/:id', (req, res) => {
  var id = parseInt(req.params.id.split("=")[1]);
  res.send(JSON.stringify(getGameById(id)));
});

app.get('/rent_game/:userId&:gameId', (req, res) => {
  var userId = getIntFromParam(req.params.userId);
  var gameId = getIntFromParam(req.params.gameId);
  var statusCode = rentGame(userId, gameId) ? 200 : 404
  res.sendStatus(statusCode);
});

app.get('/onlogin/:userName&:userPassword', (req, res) => {
  var username = getStrFromParam(req.params.userName);
  var password = getStrFromParam(req.params.userPassword);
  var userId = verifyUser(username, password);
  var statusCode = 404;
  if (userId >= 0 )
  { 
    statusCode = 200;
  }
  res.status(statusCode).json(`${userId}`);
});

app.get('/getUserData/:userId', (req, res) => {
  var userId = getIntFromParam(req.params.userId);
  res.json(JSON.stringify(getUserById(userId)));
});

app.get('/checkUsernameInDb/:userName', (req, res) => {
  var username = getStrFromParam(req.params.userName);
  res.json(JSON.stringify(isUsernameInDb(username)));
});

app.get('/getRentHistory/:userId', (req, res) => {
  var userId = getIntFromParam(req.params.userId);
  res.json(JSON.stringify(getUserRentHistory(userId)));
});

app.post('/addUser',
  (req, res) => {
    const { email, phone, password, name, surname} = req.body;
    const id = Math.max(...db.users.map(user => user.id)) + 1;
    const user = {
      "id" : id,
      "email" : email,
      "phone" : phone,
      "password" : password,
      "name" : name,
      "surname" : surname,
      "registryDate" : getTodayDate()
    };

    console.log(user);

    db.users.push(user);
    updateDb();

    res.sendStatus(200);
});

app.post('/addProblem',
  (req, res) => {
    const { userId, content} = req.body;
    const id = Math.max(...db.problems.map(p => p.id)) + 1;
    db.problems.push({
      "id" : id,
      "userId" : userId,
      "content" : content
    });

    updateDb();
    
    res.sendStatus(200);
});

app.get('/get-opinions', (req, res) => {
  res.send(JSON.stringify(getOpinionList()));
});

app.post('/addOpinion',
  (req, res) => {
    const { userId, content, stars} = req.body;
    db.opinions.push({
      "userId" : userId,
      "content" : content,
      "stars" : stars
    });

    updateDb();
    
    res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function verifyUser(username, password)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if((user.email == username || user.phone == username) && user.password == password) {
      return user.id;
    }
  }
  return -1;
}

function isUsernameInDb(username)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if(user.email == username || user.phone == username) {
      return true;
    }
  }
  return false;
}

function getUserRentHistory(userId)
{
  var userRents = db.rents.filter(item => item.userId == userId);
  let result = [];
  userRents.forEach(rent =>
    {
      var game_data = getGameById(rent.gameId);

      result.push(
        {
          "title" : game_data.title,
          "imgPath" : game_data.imgPath,
          "beginDate" : rent.beginDate,
          "endDate" : rent.endDate
        }
      );
    });
  return result;
}

function isUserIdInDb(userId)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if(user.id == userId) {
      return true;
    }
  }
  return false;
}

function getTodayDate()
{
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}.${month}.${day}`;
  
  return currentDate;
}

function getUserById(userId)
{
  for (var i = 0; i < db.users.length; i++) {
    var user = db.users[i];
    if(user.id == userId) {
      return user;
    }
  }
  return null
}
function isGameInDb(gameId)
{
  for (var i = 0; i < db.users.length; i++) {
    var game = db.games[i];
    if(game.gameId == gameId) {
      return true;
    }
  }
  return false;
}

function getGameById(gameId)
{
  return db.games.filter(game => game.gameId == gameId)[0];
}

function rentGame(userId, gameId)
{
  let game = getGameById(gameId);
  if(game === undefined || game.amount < 1 || !isUserIdInDb(userId))
  {
    return false;
  }

  game.amount -= 1;

  db.rents.push({
    "userId": userId,
    "gameId": gameId,
    "beginDate": getTodayDate(),
    "endDate": null
  });

  updateDb();
  return true;
}

function updateDb()
{
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

function getOpinionList()
{
  var op = db.opinions;
  var result = [];

  op.forEach(item =>
  {
    var user = getUserById(item.userId);
    result.push(
      {
        "userData" : user.name + " " + user.surname,
        "content" : item.content,
        "stars" : item.stars
      }
    );
  });

  return result;
}

function getOfferList()
{
  return db["games"];
}

function getStrFromParam(parameter)
{
  return parameter.split("=")[1];
}

function getIntFromParam(parameter)
{
  return parseInt(getStrFromParam(parameter));
}