document.addEventListener("DOMContentLoaded", async function(){
    const titleField = document.getElementById("title-field");
    const contentField = document.getElementById("content-field");
    const finishButton = document.querySelector(".finish-posting");
    const fileInput = document.getElementById("file");
    
    function validTitle(title) {
        return (title.value.length <= 26) && (title.value.trim() !== "");
    }

    function isValidInput(title, content) {
        return validTitle(title) && (content.value.trim() !== "");
    }

    function updateButtonState(){
        if (isValidInput(titleField, contentField)) {
            finishButton.style.backgroundColor = "#7F6AEE";
            finishButton.style.cursor = "pointer";
            finishButton.disabled = false;
        } else {
            finishButton.style.backgroundColor = "#ACA0EB";
            finishButton.style.cursor = "default";
            finishButton.disabled = true;
        }
    }

    titleField.addEventListener("input", updateButtonState);
    contentField.addEventListener("input", updateButtonState);

    finishButton.addEventListener("click", async function(){
        if (!isValidInput(titleField, contentField)) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const loggedInUser = localStorage.getItem("userId");
        if (!loggedInUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.value.trim());
        formData.append("content", contentField.value.trim());

        const file = fileInput.files[0];
        if (file) {
            formData.append("image", file);
        }

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            fetchSessionUser()
            const response = await fetch(`${BASE_URL}/posts`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert("게시글이 성공적으로 작성되었습니다!");
            window.location.href = "/pages/community-main/community-main.html"; 

        } catch (error) {
            console.error("게시글 작성 중 오류 발생:", error);
            alert("게시글 작성 실패!");
        }
    });
});
