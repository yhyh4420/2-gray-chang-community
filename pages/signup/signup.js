document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email-field");
    const passwordInput = document.getElementById("password-field");
    const passwordAgainInput = document.getElementById("password-again-field");
    const nicknameInput = document.getElementById("nickname-field");
    const emailHelperText = document.getElementById("helper-text-email");
    const passwordHelperText = document.getElementById("helper-text-password");
    const passwordAgainHelperText = document.getElementById("helper-text-password-again");
    const nicknameHelperText = document.getElementById("helper-text-nickname");
    const signupButton = document.querySelector(".signup-button");
    const profileUpload = document.getElementById("profileUpload");
    const fileInput = document.getElementById("fileInput");

    let profileImageFile = null; // 업로드된 파일 저장

    profileUpload.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            profileImageFile = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                profileUpload.style.backgroundImage = `url(${e.target.result})`;
                profileUpload.style.backgroundSize = "cover";
                profileUpload.style.backgroundPosition = "center";
                profileUpload.textContent = "";
            };
            reader.readAsDataURL(profileImageFile);
        } else {
            profileImageFile = null; // 파일이 선택되지 않으면 기본 이미지 유지
            profileUpload.style.backgroundImage = "";
            profileUpload.style.backgroundColor = "#d3d3d3";
            profileUpload.textContent = "+";
        }
    });

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+$/;
        return emailPattern.test(email);
    }

    function validatePassword(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        return passwordPattern.test(password);
    }

    function checkSamePassword(password, passwordAgain) {
        return password === passwordAgain;
    }

    function validateNickname(nickname) {
        return nickname.length <= 10 && /^\S+$/.test(nickname);
    }

    function updateButtonState() {
        const isEmailValid = validateEmail(emailInput.value);
        const isPasswordValid = validatePassword(passwordInput.value);
        const isPasswordSame = checkSamePassword(passwordInput.value, passwordAgainInput.value);
        const isNicknameValid = validateNickname(nicknameInput.value);

        signupButton.disabled = !(isEmailValid && isPasswordValid && isPasswordSame && isNicknameValid);
        signupButton.style.backgroundColor = signupButton.disabled ? "#ACA0EB" : "#7F6AEE";
        signupButton.style.cursor = signupButton.disabled ? "default" : "pointer";
    }

    emailInput.addEventListener("input", function () {
        emailHelperText.textContent = emailInput.value === ""
            ? "* 이메일을 입력해주세요"
            : !validateEmail(emailInput.value)
                ? "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)"
                : "";
        emailHelperText.style.display = emailHelperText.textContent ? "block" : "none";
        updateButtonState();
    });

    passwordInput.addEventListener("input", function () {
        passwordHelperText.textContent = passwordInput.value === ""
            ? "* 비밀번호를 입력해주세요"
            : !validatePassword(passwordInput.value)
                ? "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
                : "";
        passwordHelperText.style.display = passwordHelperText.textContent ? "block" : "none";
        updateButtonState();
    });

    passwordAgainInput.addEventListener("input", function () {
        passwordAgainHelperText.textContent = passwordAgainInput.value.trim() === ""
            ? "* 비밀번호를 다시 입력해주세요"
            : !checkSamePassword(passwordInput.value, passwordAgainInput.value)
                ? "* 비밀번호가 다릅니다."
                : "";
        passwordAgainHelperText.style.display = passwordAgainHelperText.textContent ? "block" : "none";
        updateButtonState();
    });

    nicknameInput.addEventListener("input", function () {
        nicknameHelperText.textContent = nicknameInput.value === ""
            ? "* 닉네임을 입력하세요"
            : nicknameInput.value.length > 10
                ? "* 닉네임은 최대 10자까지 가능합니다."
                : /\s/.test(nicknameInput.value)
                    ? "* 띄어쓰기를 없애주세요"
                    : "";
        nicknameHelperText.style.display = nicknameHelperText.textContent ? "block" : "none";
        updateButtonState();
    });

    signupButton.addEventListener("click", async function () {
        if (signupButton.disabled) return;

        const formData = new FormData();
        formData.append("email", emailInput.value.trim());
        formData.append("password", passwordInput.value.trim());
        formData.append("nickname", nicknameInput.value.trim());

        if (profileImageFile) {
            formData.append("image", profileImageFile);
        }

        try {
            const response = await fetch(BASE_URL + "/auth/signup", {
                method: "POST",
                credentials:"include",
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert("회원가입 성공! 로그인 해주세요.");
                window.location.href = "/pages/login/login.html";
            } else {
                alert(result.message || "회원가입 실패!");
            }
        } catch (error) {
            console.error("회원가입 요청 실패:", error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    });
});
