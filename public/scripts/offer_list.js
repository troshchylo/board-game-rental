var games;

await fetch('/get-offers')
.then(response => response.text())
.then(items => {
    games = JSON.parse(items);
})
.catch(error => console.error(error));

games.forEach(game =>
    {
        document.getElementById('item_list').innerHTML += 
        `<li>
            <img src="${game.imgPath}">
            <div class="game-info">
                <p>${game.title}</p>
                <p>Dostępność: ${game.amount} szt.</p>
                <p>${game.shortDesc}</p>
            </div>
            <a href="game_info.html?id=${game.gameId}"><div class="game-btn bttn">Dowiedz się więcej</div></a>
        </li>`;
    });



