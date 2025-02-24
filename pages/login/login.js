document.addEventListener("DOMContentLoaded", async() => {
    const emailInput = document.getElementById("email-field")
    const passwordInput = document.getElementById("password-field")
    const loginButton = document.querySelector(".login-button")
    
    const emailHelperText = document.getElementById('helper-text-email')
    const passwordHelperText = document.getElementById('helper-text-password')

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

    loginButton.addEventListener("click", async function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // users.json 가져오기
            const response = await fetch("/data/users.json");
            const users = await response.json();

            // 이메일과 비밀번호 확인
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                // 프로필 이미지가 없으면 기본 이미지 사용
                if (!user.profileImage) {
                    user.profileImage = "/assets/profiles/default.png";
                }

                alert(`환영합니다, ${user.username}님!`);
                
                // 로그인한 사용자 정보 저장
                localStorage.setItem("user", JSON.stringify(user));

                window.location.href = "/pages/community-main/community-main.html"; // 로그인 성공 시 메인 페이지로 이동
            } else {
                alert("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    });
})