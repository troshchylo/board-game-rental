var alertStr;

async function verReg(){
    alertStr = "";
    var email = document.getElementById("email").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var rPassword = document.getElementById("rPassword").value;

    document.getElementById('email').className = "normal";
    document.getElementById('name').className = "normal";
    document.getElementById('surname').className = "normal";
    document.getElementById('phone').className = "normal";
    document.getElementById('password').className = "normal";
    document.getElementById('rPassword').className = "normal";

    if (!await isValidEmail(email)) {
        alertStr += "Adres e-mail jest nieprawidłowy \n";
        document.getElementById('email').className = "wrong";
    }

    if (name.length < 3 || surname.length < 3) {
        alertStr += "Imię i nazwisko muszą zawierać więcej niż 2 znaki \n";
        document.getElementById('name').className = "wrong";
        document.getElementById('surname').className = "wrong";
    }

    if (!await isValidPhone(phone)) {
        alertStr += "Numer telefonu jest nieprawidłowy \n";
        document.getElementById('phone').className = "wrong";
    }

    if (!isValidPassword(password) ) {
        alertStr += "Hasło musi składać się z dużej i małej litery oraz znaku specjalnego\n";
        document.getElementById('password').className = "wrong";
        document.getElementById('rPassword').className = "wrong";
    }

    if (password !== rPassword) {
        alertStr += "Hasła się nie zgadzają \n";
        document.getElementById('password').className = "wrong";
        document.getElementById('rPassword').className = "wrong";
    }
    console.log(alertStr);
    if(alertStr != "")
        alert(alertStr);
    else{
        console.log(email);
        console.log(name);
        console.log(surname);
        console.log(phone);
        console.log(password);
        fetch('/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email' : email,
                'name' : name,
                'surname' : surname,
                'phone' : phone, 
                'password': password
            })
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
            })
            .then((data) => console.log(data))
            .catch((error) => console.log(error));

            window.location.href = "login.html";
    }
}


async function isValidEmail(email) {
    var isEmailInDB;
    await fetch(`/checkUsernameInDb/userName=${email}`)
    .then(response => 
    {
      return response.text();
    })
    .then(data => {
        isEmailInDB = data === `"true"`;
    })
    .catch(error => console.error(error));

    if(!isEmailInDB){
        return email.includes("@") && email.split("@")[1].includes(".") && email.split("@")[1].length > 3 && email.split("@")[0].length > 0;
    }
    else{
        alertStr += "Użytkownik z takim mailem już jest zarejestrowany \n";
        document.getElementById('email').className = "wrong";
        return false;
    }
}

async function isValidPhone(phone) {
    var isPhoneInDB;
    await fetch(`/checkUsernameInDb/userName=${phone}`)
    .then(response => 
    {
      return response.text();
    })
    .then(data => {
        isPhoneInDB = data === `"true"`;
    })
    .catch(error => console.error(error));

    if(!isPhoneInDB){
        return /^(\+48)?\d{9}$/.test(phone);
    }
    else{
        document.getElementById('phone').className = "wrong";
        alertStr += "Użytkownik z takim nr telefonu już jest zarejestrowany \n";
        return false;
    }
}

function isValidPassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
}

document.getElementById('regBttn').addEventListener('click', verReg);