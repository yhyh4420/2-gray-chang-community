document.addEventListener("DOMContentLoaded", async() => {
    const emailInput = document.getElementById("email-field")
    const passwordInput = document.getElementById("password-field")
    const loginButton = document.querySelector(".login-button")
    
    const emailHelperText = document.getElementById('helper-text-email')
    const passwordHelperText = document.getElementById('helper-text-password')

    let users = []
    async function getUsers() {
        try{
            const response = await fetch("/data/users.json")
            if (!response.ok) {
                throw new Error("사용자 데이터를 불러오지 못했습니다.")
            }
            users = await response.json()
            return users
        } catch (error) {
            console.log(error)
            return null
        }
    }

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

    await getUsers()

    loginButton.addEventListener("click", function () {
        if (!validateEmail(emailInput.value) || !validatePassword(passwordInput.value)) {
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        // JSON 데이터에서 이메일과 비밀번호가 일치하는 사용자 찾기
        const user = users.find((user) => user.email === email && user.password === password);

        if (user) {
            alert(`환영합니다, ${user.username}님!`);
            window.location.href = "/pages/community-main/community-main.html";
        } else {
            alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    });
})