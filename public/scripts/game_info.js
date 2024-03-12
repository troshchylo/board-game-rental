import {readCookie} from "./cookiesHandler.js";

const gameId = (new URLSearchParams(window.location.search)).get("id");
var game_info;

await fetch(`/game_info/id=${gameId}`)
.then(response => response.text())
.then(items => {
    game_info = JSON.parse(items);
})
.catch(error => console.error(error));

document.getElementById("game-container").innerHTML += 
`<img src="${game_info.imgPath}" alt="">
<div class="game-text">
    <p>${game_info.title}</p>
    <p>Dostępność: ${game_info.amount} szt.</p>
    <p>${game_info.longDesc}</p>
</div>`;

document.getElementById("rent_btn").addEventListener("click", ev => {
    var userId = readCookie("userId")

    if(userId == null){
        window.location.href = "login.html";
        return;
    }

    fetch(`/rent_game/userId=${userId}&gameId=${gameId}`)
    .then(response => {
        if(response.status == 200)
        {
            location.reload();
            alert("Transakcja zakończona pomyślnie")
        } else {
            alert("Transakcja nie zakończona")
        }
    })
    .catch(error => console.error(error));

});


