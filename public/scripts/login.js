import {readCookie, createCookie} from "./cookiesHandler.js";
var username = readCookie("userId")

if(username != null){
  window.location.href = "profil_dane.html";
}

async function onLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var statusCode;
  var userId;
  
  await fetch(`/onlogin/userName=${username}&userPassword=${password}`)
    .then(response => 
    {
      statusCode = response.status;
      return response.text();
    })
    .then(data => {
      userId = JSON.parse(data);
    })
    .catch(error => console.error(error));

  console.log(userId);
  if(statusCode == 200)
  {
    createCookie("userId", userId, 1);
    window.location.href = "profil_dane.html";
    return;
  }

  document.getElementById('username').className = "wrong";
  document.getElementById('password').className = "wrong";
}

document.getElementById('login').addEventListener('click', onLogin);