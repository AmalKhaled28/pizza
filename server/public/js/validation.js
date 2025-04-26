const nameText = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.getElementById("form");



form.addEventListener('submit',  e => {
    e.preventDefault();

    if(checkInputs() != false){
     form.submit();
    }
});

function checkInputs() {
    
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    
    if(nameText !== null){
     const nameValue = nameText.value.trim();
    
      if (nameValue === '') {
        setErrorFor(nameText, 'Please enter your name');
        return false;
      } else {
        setSuccessFor(nameText);
      }
    }

    if (emailValue === '') {
        setErrorFor(email, 'Please enter your email');
        return false;
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Email not valid');
        return false;
    } else {
        setSuccessFor(email);
    }

    if (passwordValue === '') {
        setErrorFor(password, 'Please enter password');
        return false;
    } else if (!isPassword(passwordValue)) {
        setErrorFor(password, 'atleast one number, one uppercase, lowercase letter, and atleast 8 character');
        return false;
    }else {
        setSuccessFor(password);
    }

    return true;

  
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isPassword(password){  
    return /^^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password);
}