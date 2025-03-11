document.addEventListener("DOMContentLoaded", async () => {
    const emailInput = document.getElementById("email-field");
    const passwordInput = document.getElementById("password-field");
    const loginButton = document.querySelector(".login-button");

    const emailHelperText = document.getElementById("helper-text-email");
    const passwordHelperText = document.getElementById("helper-text-password");

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+$/;
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
            loginButton.disabled = false;
        } else {
            loginButton.style.backgroundColor = "#ACA0EB";
            loginButton.style.cursor = "default";
            loginButton.disabled = true;
        }
    }

    emailInput.addEventListener("input", function () {
        emailHelperText.style.display = validateEmail(emailInput.value) ? "none" : "block";
        emailHelperText.textContent = "* 올바른 이메일 형식을 입력하세요.";
        updateButtonState();
    });

    passwordInput.addEventListener("input", function () {
        passwordHelperText.style.display = validatePassword(passwordInput.value) ? "none" : "block";
        passwordHelperText.textContent = "* 비밀번호는 8~20자이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
        updateButtonState();
    });

    loginButton.addEventListener("click", async function () {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("로그인 성공:", data);

            alert(`환영합니다, ${data.nickname}님!`);
            localStorage.setItem("userId", data.userId)
            localStorage.setItem("nickname", data.nickname)
            localStorage.setItem("profileImage", data.profileImage)
            
            window.location.href = "/pages/community-main/community-main.html";

        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
        }
    })
});
