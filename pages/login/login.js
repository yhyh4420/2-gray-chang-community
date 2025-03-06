document.addEventListener("DOMContentLoaded", async () => {
    const emailInput = document.getElementById("email-field");
    const passwordInput = document.getElementById("password-field");
    const loginButton = document.querySelector(".login-button");
    
    const emailHelperText = document.getElementById('helper-text-email');
    const passwordHelperText = document.getElementById('helper-text-password');

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailPattern.test(email);
    }

    function validatePassword(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        return passwordPattern.test(password);
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
    });

    passwordInput.addEventListener("input", function () {
        if (passwordInput.value === "") {
            passwordHelperText.textContent = "* 비밀번호를 입력하세요.";
            passwordHelperText.style.display = "block";
        } else if (!validatePassword(passwordInput.value)) {
            passwordHelperText.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.display = "block";
        } else {
            passwordHelperText.style.display = "none";
        }
        updateButtonState();
    });

    // 기존 로그인된 사용자 확인 (로그인 유지 기능)
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            alert("이미 로그인되어 있습니다.");
            window.location.href = "/pages/community-main/community-main.html"; // 메인 페이지로 이동
        }
    }

    checkLoginStatus()

    loginButton.addEventListener("click", async function () {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            });
            

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("로그인 성공:", data);

            // 로그인 성공 시 이메일 저장 (비밀번호는 저장하지 않음)
            localStorage.setItem("loggedInUser", email);

            alert(`환영합니다, ${email}님!`);
            window.location.href = "/pages/community-main/community-main.html"; // 로그인 성공 후 이동

        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
        }
    });
});