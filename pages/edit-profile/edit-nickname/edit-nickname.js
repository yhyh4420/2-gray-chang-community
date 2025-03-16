document.addEventListener("DOMContentLoaded", async function(){
    const userEmail = document.querySelector(".user-email")
    const nickname = document.querySelector(".user-nickname")
    const profileUpload = document.getElementById("profileUpload");
    const fileInput = document.getElementById("fileInput");
    const helperText = document.querySelector(".helper-text")
    const editButton = document.getElementById("edit")
    const tostMessage = document.getElementById("tost-message")
    const resignButton = document.getElementById("resign")
    const modalBackGround = document.querySelector(".modal-background")
    const modalWrap = document.querySelector(".modal-wrap")
    const modalCancel = document.getElementById("modal-cancel")
    const modalResign = document.getElementById("modal-resign")

    const userData = await fetchSessionUser()
    userEmail.textContent = userData.email;

    profileUpload.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function(event) {
        let profileImage = event.target.files[0];
        if (profileImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileUpload.style.backgroundImage = `url(${e.target.result})`;
                profileUpload.style.backgroundSize = "cover";
                profileUpload.style.backgroundPosition = "center";
                profileUpload.textContent = "";
            };
            reader.readAsDataURL(profileImage);
        }
    });

    editButton.addEventListener("click", async function(){
        const newNickname = nickname.value.trim();
        if (newNickname === ""){
            helperText.textContent = "* 닉네임을 입력하세요.";
            helperText.style.display = "block";
            return;
        } else if(newNickname.length > 10){
            helperText.textContent = "* 닉네임은 최대 10글자 까지 작성 가능합니다.";
            helperText.style.display = "block";
            return;
        }

        const formData = new FormData();
        formData.append("nickName", newNickname);

        if (fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/update/nickname`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "닉네임 변경 실패");
            }

            tostMessage.classList.add('active');
            setTimeout(() => {
                tostMessage.classList.remove('active');
            }, 2000);

            alert("닉네임이 변경되었습니다.");
            window.location.href = "/pages/community-main/community-main.html";
        } catch (error) {
            console.error("닉네임 수정 오류:", error);
            alert("닉네임 변경 중 오류가 발생했습니다.");
        }
    });

    resignButton.addEventListener("click", function(){
        modalBackGround.style.display = "flex"
        modalWrap.style.display = "flex"
    })

    modalResign.addEventListener("click", async function(){
        try {
            const response = await fetch(`${BASE_URL}/auth/resign`, {
                method: "DELETE",
                credentials: "include"
            });
    
            if (!response.ok) {
                throw new Error("회원 탈퇴 실패");
            }
    
            alert("회원 탈퇴가 완료되었습니다.");
            localStorage.clear(); // 로컬 스토리지 삭제
            document.cookie = "sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None"; // 쿠키 삭제
            window.location.href = "/pages/login/login.html"; // 로그인 페이지로 이동
        } catch (error) {
            console.error("회원 탈퇴 오류:", error);
            alert("회원 탈퇴 중 오류가 발생했습니다.");
        } finally {
            modalBackGround.style.display = "none";
            modalWrap.style.display = "none";
        }
    });
    

    modalCancel.addEventListener("click", function(){
        modalBackGround.style.display = "none"
        modalWrap.style.display = "none"
    })
})