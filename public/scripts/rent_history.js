import {readCookie} from "./cookiesHandler.js";
var userId = readCookie("userId")

if(userId == null){
  window.location.href = "login.html";
}



var rents;

await fetch(`/getRentHistory/id=${userId}`)
.then(response => response.text())
.then(items => {
    rents = JSON.parse(JSON.parse(items));
})
.catch(error => console.error(error));

rents.sort((item1, item2) => item2.beginDate.localeCompare(item1.beginDate));

rents.forEach(item =>
    {
        document.getElementById('item_list').innerHTML += 
        `<li>
            <img src="${item.imgPath}" alt="">
            <div class="item-info">
                <p>${item.title}</p>
                <p>${item.beginDate} — ${item.endDate == null ? "aktywne" : item.endDate}</p>
            </div>
        </li>`;
    });
