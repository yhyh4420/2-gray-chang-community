document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); 

    if (!postId) {
        alert("잘못된 접근입니다.");
        window.location.href = "/pages/community-main/community-main.html";
        return;
    }
    
    const titleField = document.getElementById("title-field");
    const contentField = document.getElementById("content-field");
    const fileInput = document.getElementById("file");
    const imagePreviewContainer = document.getElementById("image-preview-container");
    const imagePreview = document.getElementById("image-preview");
    const removeImageButton = document.getElementById("remove-image");
    const finishButton = document.querySelector(".finish-posting");

    let uploadedImage = null; // 기존 이미지 정보

    // 기존 게시글 정보 불러오기
    try {
        const postResponse = await fetch(`${BASE_URL}/posts/${postId}`, {
            method:"GET",
            credentials:"include"
        });

        if (!postResponse.ok){
            throw new Error(`게시글 불러오기 실패: ${postResponse.status}`);
        }

        const postData = await postResponse.json();
        
        titleField.value = postData.post.title;
        contentField.value = postData.post.content;
        uploadedImage = postData.post.image;

        if (uploadedImage) {
            imagePreview.src = BASE_URL + uploadedImage;
            imagePreviewContainer.style.display = "block";
        }

    } catch (error) {
        console.error("게시글 로딩 오류:", error);
    }

    function isValidInput() {
        return titleField.value.trim() !== "" && contentField.value.trim() !== "";
    }

    function updateButtonState() {
        finishButton.disabled = !isValidInput();
    }

    titleField.addEventListener("input", updateButtonState);
    contentField.addEventListener("input", updateButtonState);

    // ✅ 이미지 삭제 버튼 클릭 시 기존 이미지 제거
    removeImageButton.addEventListener("click", function () {
        imagePreviewContainer.style.display = "none"; // 이미지 숨김
        uploadedImage = null; // 기존 이미지 정보 제거
        fileInput.value = ""; // 파일 입력값 초기화 (사용자가 업로드한 파일이 있으면 무효화)
    });

    // ✅ 게시글 수정 버튼 클릭 시 서버로 요청
    finishButton.addEventListener("click", async function () {
        if (!isValidInput()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("title", titleField.value.trim());
        formData.append("content", contentField.value.trim());

        // ✅ 새로운 이미지가 업로드되었을 경우에만 추가
        if (fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
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
            console.error("게시글 수정 오류:", error);
        }
    });
});
