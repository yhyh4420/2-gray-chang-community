document.addEventListener("DOMContentLoaded", function(){
    const emailInput = document.getElementById("email-field")
    const passwordInput = document.getElementById("password-field")
    const passwordAgainInput = document.getElementById("password-again-field")
    const nicknameInput = document.getElementById("nickname-field")
    const emailHelperText = document.getElementById("helper-text-email")
    const passwordHelperText = document.getElementById("helper-text-password")
    const passwordAgainHelperText = document.getElementById("helper-text-password-again")
    const nicknameHelperText = document.getElementById("helper-text-nickname")
    const signupButton = document.querySelector(".signup-button")
    const profileUpload = document.getElementById("profileUpload");
    const fileInput = document.getElementById("fileInput");

    profileUpload.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                profileUpload.style.backgroundImage = `url(${e.target.result})`;
                profileUpload.style.backgroundSize = "cover";
                profileUpload.style.backgroundPosition = "center";
                profileUpload.textContent = ""; 
            };

            reader.readAsDataURL(file);
        } else {
            profileUpload.style.backgroundImage = "";
            profileUpload.style.backgroundColor = "#d3d3d3";
            profileUpload.textContent = "+";
        }
    });


    function validateEmail(email){
        const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+$/;
        return emailPattern.test(email)
    }

    function validatePassword(password){
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
        return passwordPattern.test(password)
    }

    function checkSamePassword(password, passwordAgain){
        return (password == passwordAgain)
    }

    function validNicknameContainSpace(nickname){
        const nicknamePattern = /^\S+$/
        return nicknamePattern.test(nickname)
    }

    function validNicknameLength(nickname){
        return (nickname.length<=10)
    }

    function updateButtonState() {
        const isEmailValid = validateEmail(emailInput.value);
        const isPasswordValid = validatePassword(passwordInput.value);
        const isPasswordSame = checkSamePassword(passwordInput.value, passwordAgainInput.value);
        const isNicknameValid = validNicknameContainSpace(nicknameInput.value) && validNicknameLength(nicknameInput.value);

        if (isEmailValid && isPasswordValid && isPasswordSame && isNicknameValid) {
            signupButton.style.backgroundColor = "#7F6AEE";
            signupButton.style.cursor = "pointer";
            signupButton.disabled = false;
        } else {
            signupButton.style.backgroundColor = "#ACA0EB";
            signupButton.style.cursor = "default";
            signupButton.disabled = true;
        }
    }
    

    emailInput.addEventListener("input", function () {
        if (emailInput.value === ""){
            emailHelperText.textContent = "* 이메일을 입력해주세요";
            emailHelperText.style.display = "block";
        } else if (!validateEmail(emailInput.value)) {
            emailHelperText.textContent = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
            emailHelperText.style.display = "block";
        } else {
            emailHelperText.style.display = "none";
        }
        updateButtonState();
    })

    passwordInput.addEventListener("input", function() {
        if (passwordInput.value === "") {
            passwordHelperText.textContent = "* 비밀번호를 입력해주세요";
            passwordHelperText.style.display = "block";
        } else if (!validatePassword(passwordInput.value)) {
            passwordHelperText.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.display = "block";
        } else {
            passwordHelperText.style.display = "none";
        }

        updateButtonState();
    })


    passwordAgainInput.addEventListener("input", function() {
        if (passwordAgainInput.value.trim() === ""){
            passwordAgainHelperText.textContent = "* 비밀번호를 다시 입력해주세요";
            passwordAgainHelperText.style.display = "block";
        } else if (!checkSamePassword(passwordInput.value, passwordAgainInput.value)) {
            passwordAgainHelperText.textContent = "* 비밀번호가 다릅니다.";
            passwordAgainHelperText.style.display = "block";
        } else {
            passwordAgainHelperText.style.display = "none";
        }
        updateButtonState();
    });

    nicknameInput.addEventListener("input", function() {
        if (nicknameInput.value === "") {
            nicknameHelperText.textContent = "* 닉네임을 입력하세요"
            nicknameHelperText.style.display = "block"
        } else if (!validNicknameLength(nicknameInput.value)) {
            nicknameHelperText.textContent = "* 닉네임은 최대 10자까지 가능합니다."
            nicknameHelperText.style.display = "block"
        } else if (!validNicknameContainSpace(nicknameInput.value)) {
            nicknameHelperText.textContent = "* 띄어쓰기를 없애주세요"
            nicknameHelperText.style.display = "block"
        } else {
            nicknameHelperText.style.display = "none"
        }

        updateButtonState();
    })
})