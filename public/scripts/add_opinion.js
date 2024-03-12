import {readCookie} from "./cookiesHandler.js";
var opinions
var userId = readCookie("userId")

await fetch('/get-opinions')
.then(response => response.text())
.then(items => {
    opinions = JSON.parse(items);
})
.catch(error => console.error(error));

opinions.forEach(opinion =>
    {
        document.getElementById('opinie').innerHTML += 
        `<li>
            <p>${opinion.userData}</p>
            ${"<span class=\"fa fa-star checked\"></span>".repeat(opinion.stars)}
            ${"<span class=\"fa fa-star\"></span>".repeat(5 - opinion.stars)}
            <p>${opinion.content}</p>
        </li>`;
    });

document.getElementById("add_opinion_btn").addEventListener("click", ev => {
    var userId = readCookie("userId")

    if(userId == null){
        window.location.href = "login.html";
        return;
    }

    let text = document.getElementById("opinion_text");
    if(text.value.length <= 10){
        text.classList.add("wrong");
        return;
    }

    let stars = parseStars();

    console.log(stars);
    fetch('/addOpinion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId": userId,
            "content": text.value,
            "stars" : stars
        })
        })
        .then((res) => {
            if (res.ok) {
                alert("Opinia została pomyślnie dodana!");
                location.reload();
                return res.json();
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    
})

function parseStars(){
    let starsCount = 0;

    document.getElementsByName("rating").forEach(item =>
    {
        if(item.checked){
            starsCount += parseInt(item.value);
        }
    });
    return starsCount;
}

