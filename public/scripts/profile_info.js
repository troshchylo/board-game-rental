import {readCookie, eraseCookie} from "./cookiesHandler.js";
var userId = readCookie("userId")

if(userId == null){
  window.location.href = "login.html";
}

var user;

await fetch(`/getUserData/id=${userId}`)
.then(response => response.text())
.then(items => {
  console.log(items);
  user = JSON.parse(JSON.parse(items));
})
.catch(error => console.error(error));

document.getElementById("profile_info").innerHTML += 
`<div class="profil-context">
    <p>${user.name} ${user.surname}</p>
    <p>E-mail:</p>
    <p>Telefon:</p>
    <p>Hasło:</p>
    <p>Data rejestracji:</p>
</div>
<div class="profil-context">
    <p>  
    <p>${user.email.substring(0, 3) + '*'.repeat(user.email.length-9) + user.email.substring(user.email.length-6)}</p>
    <p>${'*'.repeat(user.phone.length-3) + user.phone.substring(user.phone.length-3)}</p>
    <p>${'*'.repeat(8)}</p>
    <p>${user.registryDate}</p>
</div>`;