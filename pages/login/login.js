document.addEventListener("DOMContentLoaded", function(){
    const emailInput = document.getElementById("email-field")
    const passwordInput = document.getElementById("password-field")
    const loginButton = document.querySelector(".login-button")
    const emailHelperText = document.getElementById('helper-text-email')
    const passwordHelperText = document.getElementById('helper-text-password')
    const signupLink = document.getElementsByClassName("signup-link")


    function validateEmail(email){
        const emailPattern = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        return emailPattern.test(email)
    }

    function validatePassword(password){
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
        return passwordPattern.test(password)
    }

    function updateButtonState() {
        if (validateEmail(emailInput.value) && validatePassword(passwordInput.value)) {
            loginButton.style.backgroundColor = "#7F6AEF";
            loginButton.style.cursor = "pointer";
        } else {
            loginButton.style.backgroundColor = "#ACA0EB";
            loginButton.style.cursor = "default";
        }
    }

    emailInput.addEventListener("input", function () {
        if (!validateEmail(emailInput.value)) {
            emailHelperText.textContent = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
            emailHelperText.style.display = "block";
        } else {
            emailHelperText.style.display = "none";
        }
        updateButtonState();
    })

    passwordInput.addEventListener("input", function () {
        if (passwordInput.value === "") {
            passwordHelperText.textContent = "* 비밀번호를 입력하세요.";
            passwordHelperText.style.display = "block";
        }
        else if (!validatePassword(passwordInput.value)) {
            passwordHelperText.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.display = "block";
        } else {
            passwordHelperText.style.display = "none";
        }
        updateButtonState();
    })

    loginButton.addEventListener("click", function(){
        if (validateEmail(emailInput.value) && validatePassword(passwordInput.value)) {
            window.location.href = "/post.html";
        }
    })
})