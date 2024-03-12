import {eraseCookie} from "./cookiesHandler.js";

function onLogout()
{
    eraseCookie("userId");
    window.location.href = "login.html";
}

document.getElementById('logout').addEventListener('click', onLogout);