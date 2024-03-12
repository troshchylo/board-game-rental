import {readCookie} from "./cookiesHandler.js";
var userId = readCookie("userId")

if(userId == null){
  window.location.href = "login.html";
}

function sendProblem(){
    var content = document.getElementById("content").value;
    console.log(content);
    console.log(userId);
    fetch('/addProblem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'userId' : userId,
            'content' : content
        })
        })
        .then((res) => {
            if (res.ok) {
                location.reload();
                return res.json();
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
}

document.getElementById('sendProb').addEventListener('click', sendProblem);