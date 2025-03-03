document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id"); // URL에서 게시글 ID 가져오기
    
    console.log("📌 현재 URL:", window.location.href);  // 현재 URL 확인
    console.log("📌 가져온 postId:", postId);  // postId 값 확인

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
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const post = posts.find(p => p.id == postId);

        if (!post) {
            alert("게시글을 찾을 수 없습니다.");
            window.location.href = "/pages/community-main/community-main.html";
            return;
        }

        // 기존 데이터 표시
        titleField.value = post.title;
        contentField.value = post.content;
        uploadedImage = post.image; // 기존 이미지 유지

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

    // 🔥 이미지 업로드 처리
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage = e.target.result; // Base64 변환된 이미지 저장
                console.log("✅ 이미지 업로드 완료:", uploadedImage);
            };
            reader.readAsDataURL(file);
        }
    });

    // 🔥 게시글 수정 버튼 클릭 이벤트
    finishButton.addEventListener("click", function () {
        if (!isValidInput()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        let postIndex = posts.findIndex(p => p.id == postId);

        if (postIndex === -1) {
            alert("게시글을 찾을 수 없습니다.");
            return;
        }

        // 🔥 수정된 데이터 반영
        posts[postIndex] = {
            ...posts[postIndex], // 기존 데이터 유지
            title: titleField.value.trim(),
            content: contentField.value.trim(),
            image: uploadedImage, // 변경된 이미지 적용
            updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") // 수정 시간 반영
        };

        // 🔥 수정된 데이터 저장
        localStorage.setItem("posts", JSON.stringify(posts));

        alert("게시글이 수정되었습니다.");
        window.location.href = `/pages/post-detail/post-detail.html?id=${postId}`;
    });
});
