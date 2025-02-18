document.addEventListener("DOMContentLoaded", function(){
    const passwordInput = document.getElementById("password-field")
    const passwordAgainInput = document.getElementById("password-again-field")
    const passwordHelperText = document.getElementById("helper-password")
    const passwordAgainHelperText = document.getElementById("helper-password-again")
    const editButton = document.getElementById("edit")
    const tostMessage = document.getElementById("tost-message")

    function validatePassword(password){
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
        return passwordPattern.test(password)
    }

    function checkSamePassword(password, passwordAgain){
        return (password == passwordAgain)
    }

    function updateButtonState() {
        const isPasswordValid = validatePassword(passwordInput.value);
        const isPasswordSame = checkSamePassword(passwordInput.value, passwordAgainInput.value);

        if (isPasswordValid && isPasswordSame) {
            editButton.style.backgroundColor = "#7F6AEE";
            editButton.style.cursor = "pointer";
            editButton.disabled = false;
            editButton.addEventListener("click", function(){
                tostMessage.classList.add('active')
                setTimeout(function(){
                    tostMessage.classList.remove('active')
                }, 2000)
            })
        } else {
            editButton.style.backgroundColor = "#ACA0EB";
            editButton.style.cursor = "default";
            editButton.disabled = true;
        }
    }

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
    })
})