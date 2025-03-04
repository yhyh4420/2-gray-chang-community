document.addEventListener("DOMContentLoaded", async () => {
    const profileImage = document.getElementById("profile-image");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const nicknameBtn = document.getElementById("edit-nickname");
    const passwordBtn = document.getElementById("edit-password");
    const logoutBtn = document.getElementById("logout-btn");
    const postListElement = document.querySelector(".post-list");

    try {
        // 1. 사용자 데이터 가져오기
        const userResponse = await fetch("/data/users.json");
        const users = await userResponse.json();

        // 로그인된 사용자 가져오기(localStorage 저장된 이메일 기반)
        const loggedInUserEmail = localStorage.getItem("loggedInUser");
        const loggedInUser = users.find(user => user.email === loggedInUserEmail);

        if (!loggedInUser) {
            alert("로그인이 필요합니다.");
            window.location.href = "/pages/login/login.html";
            return;
        }

        // 로그인한 사용자 정보 적용
        profileImage.src = loggedInUser.profileImage || "/assets/profiles/default-avatar.png";

        // 2. 게시글 데이터 가져오기
        const response = await fetch("/data/posts.json");
        let posts = await response.json();

        // storedPosts : 기존 더미데이터 말고 실제 추가한 데이터
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];

        posts = [...storedPosts, ...posts];

        // 기존 게시글 제거
        postListElement.innerHTML = "";

        // 3. 게시글 동적으로 추가
        posts.forEach(post => {
            // 게시글 작성자의 프로필 이미지 찾기
            const postAuthor = users.find(user => user.username === post.username);
            const authorProfileImage = postAuthor?.profileImage || "/assets/profiles/default-avatar.png";
            const authorName = postAuthor?.username || "탈퇴한 사용자";

            const postItem = document.createElement("article");
            postItem.classList.add("post-item");
            postItem.innerHTML = `
                <h2 class="post-title" onclick="location.href='/pages/post-detail/post-detail.html?id=${post.id}'">${post.title}</h2>
                <div class="post-info-wrapper">
                    <div class="post-info">
                        <span>좋아요 ${post.likes}</span>
                        <span>댓글 ${post.comments}</span>
                        <span>조회수 ${post.views}</span>
                    </div>
                    <div class="post-time">${post.createdAt}</div>
                </div>
                <hr class="post-divider">
                <div class="post-user-info">
                    <img class="author-avatar" src="${authorProfileImage}" alt="프로필 이미지">
                    <span class="author-name">${authorName}</span>
                </div>
            `;
            postListElement.appendChild(postItem);
        });
    } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        postListElement.innerHTML = "<p>게시글을 불러오는 중 문제가 발생했습니다.</p>";
    }

    // 4. 프로필 이미지 클릭 시 드롭다운 메뉴 토글
    profileImage.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle("visible");
    });

    // 5. 회원정보 수정 버튼
    nicknameBtn.addEventListener("click", () => {
        window.location.href = "/pages/edit-profile/edit-nickname/edit-nickname.html";
    });

    passwordBtn.addEventListener("click", () => {
        window.location.href = "/pages/edit-profile/edit-password/edit-password.html";
    });

    // 6. 로그아웃 기능
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("로그아웃 되었습니다.");
        window.location.href = "/pages/login/login.html";
    });

    // 7. 바깥 영역 클릭하면 드롭다운 닫기
    document.addEventListener("click", (event) => {
        if (!profileImage.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("visible");
        }
    });
});
