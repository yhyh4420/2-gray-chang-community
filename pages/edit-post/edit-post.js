document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); // URL에서 게시글 ID 가져오기

    if (!postId) {
        alert("잘못된 접근입니다.");
        window.location.href = "/pages/community-main/community-main.html";
        return;
    }
    
    const titleField = document.getElementById("title-field");
    const contentField = document.getElementById("content-field");
    const fileInput = document.getElementById("file");
    const finishButton = document.querySelector(".finish-posting");
    let uploadedImage = null;

    // 🔥 기존 게시글 정보 불러오기
    try {
        const postResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
            method:"GET",
            credentials:"include"
        })
        if (!postResponse.ok){
            throw new Error(`게시글 불러오기 실패: ${postResponse.status}`);
        }
        
        const userData = fetchSessionUser()
        const postData = await postResponse.json()
        if (userData.userId === postData.post.userId) {
            alert("작성자만 게시글을 수정할 수 있습니다.")
            window.location.href = "/pages/community-main/community-main.html";
            return;
        }

        if (!postData) {
            alert("게시글을 찾을 수 없습니다.");
            window.location.href = "/pages/community-main/community-main.html";
            return;
        }

        // 기존 데이터 표시
        titleField.value = postData.post.title;
        contentField.value = postData.post.content;
        uploadedImage = postData.post.image;

    } catch (error) {
        console.error("게시글 로딩 오류:", error);
    }

    function isValidInput() {
        return titleField.value.trim() !== "" && contentField.value.trim() !== "";
    }

    function updateButtonState() {
        if (isValidInput()) {
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
    
    finishButton.addEventListener("click", async function () {
        if (!isValidInput()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.value.trim())
        formData.append("content", contentField.value.trim())
        const file = fileInput.files[0];
        if (file) {
            formData.append("image", file);
        }
    
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        try {
            const updateResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });
            if (!updateResponse.ok) {
                throw new Error("게시글 수정 실패");
            }
            alert("게시글이 수정되었습니다.");
            window.location.href = `/pages/post-detail/post-detail.html?id=${postId}`;
        } catch (error){
            console.error("게시글 삭제 오류:", error);
        }
    });
});
