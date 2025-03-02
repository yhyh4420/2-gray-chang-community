document.addEventListener("DOMContentLoaded", async function(){
    const titleField = document.getElementById("title-field");
    const contentField = document.getElementById("content-field");
    const finishButton = document.querySelector(".finish-posting");

    function isValidInput(title, content) {
        return title.value.trim() !== "" && content.value.trim() !== "";
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

        // 🔥 로그인한 사용자 정보 가져오기
        const loggedInUserEmail = localStorage.getItem("loggedInUser");
        if (!loggedInUserEmail) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 🔥 users.json에서 username 찾기
        let username = loggedInUserEmail; // 기본값은 email
        try {
            const userResponse = await fetch("/data/users.json");
            const users = await userResponse.json();
            const loggedInUser = users.find(user => user.email === loggedInUserEmail);
            if (loggedInUser) {
                username = loggedInUser.username; // 🔥 username으로 변환
            }
        } catch (error) {
            console.error("❌ users.json을 불러오는데 실패했습니다:", error);
        }

        // 🔥 username이 적용된 게시글 생성
        const newPost = {
            id: Date.now(), // 고유 ID 생성
            title: titleField.value.trim(),
            content: contentField.value.trim(),
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            username: username // 🔥 변환된 username 적용
        };

        // 기존 게시글 불러오기 (localStorage 활용)
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        storedPosts.unshift(newPost); // 최신 게시글을 위로 추가
        localStorage.setItem("posts", JSON.stringify(storedPosts));

        // 메인 페이지로 이동
        window.location.href = '/pages/community-main/community-main.html';
    });
});
